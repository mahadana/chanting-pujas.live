import $ from "cheerio";
import _ from "lodash";
import striptags from "striptags";

const ALLOWED_TAGS = ["em", "i", "strong", "u"];

const getCleanHtml = (el) =>
  striptags($(el).html(), ALLOWED_TAGS)
    .replace(/<([A-Za-z]+)[^>]+>/g, "<$1>")
    .trim();

const cleanObject = (object) =>
  _.pickBy(
    object,
    (value) => !_.isUndefined(value) && !(_.isArray(value) && value.length == 0)
  );

const getAttribute = (el, name) => $(el)?.[0]?.attribs?.[name];

const getBooleanAttribute = (el, name) =>
  typeof getAttribute(el, name) !== "undefined";

const getElAttributes = (el) => ({
  leader: getBooleanAttribute(el, "leader") || undefined,
  lang: getLanguage(el),
  center: getBooleanAttribute(el, "center") || undefined,
  right: getBooleanAttribute(el, "right") || undefined,
});

const getLanguage = (el) => {
  for (const name of ["mixed", "pi", "en"]) {
    if (getBooleanAttribute(el, name)) {
      return name;
    }
  }
  return undefined;
};

const mapChildren = (parentEl, callback) =>
  $(parentEl)
    .children()
    .map(function (index) {
      const childEl = $(this);
      const type = String(childEl.prop("tagName")).toLowerCase();
      return callback(childEl, type, index);
    })
    .get()
    .filter((el) => el);

const walkRow = (parent) =>
  mapChildren(parent, (el, type) => {
    if (type === "verse") {
      return cleanObject({
        type,
        ...getElAttributes(el),
        html: getCleanHtml(el),
      });
    } else {
      console.warn(`Unexpected tag ${type}`);
    }
  });

const walkGrid = (parent) =>
  mapChildren(parent, (el, type) => {
    if (type === "row") {
      return cleanObject({
        type,
        ...getElAttributes(el),
        children: walkRow(el),
      });
    } else {
      console.warn(`Unexpected tag ${type}`);
    }
  });

const walkGroup = (parent) =>
  mapChildren(parent, (el, type) => {
    if (type === "verse") {
      return cleanObject({
        type,
        ...getElAttributes(el),
        html: getCleanHtml(el),
      });
    } else {
      console.warn(`Unexpected tag ${type}`);
    }
  });

const walkChant = (parent) =>
  mapChildren(parent, (el, type) => {
    switch (type) {
      case "group":
        return cleanObject({
          type,
          ...getElAttributes(el),
          children: walkGroup(el),
        });
      case "grid":
        return cleanObject({
          type,
          ...getElAttributes(el),
          children: walkGrid(el),
        });
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
      case "aside": {
        let match = type.match(/^h(\d)$/);
        if (match) {
          type = `h${parseInt(match[1]) - 1}`;
        }
        return cleanObject({
          type,
          ...getElAttributes(el),
          html: getCleanHtml(el),
        });
      }
      case "chantmeta":
        return {
          key: getAttribute(el, "key"),
          value: getAttribute(el, "value"),
        };
      default:
        console.warn(`Unexpected tag ${type}`);
    }
  });

export const parseChantingHtml = (html) =>
  $.load(html)("chant")
    .map(function () {
      const el = $(this);
      const chant = {
        volume: null,
        part: null,
        id: null,
        type: null,
        lang: getLanguage(el),
        title: null,
      };
      let children;
      if (getBooleanAttribute(el, "raw")) {
        chant.type = "raw";
        children = el
          .html()
          .trim()
          .split("\n")
          .map((l) => l.trim());
        chant.html = children.slice(5).join("\n");
        const meta = "<chant>" + children.slice(0, 5).join("\n") + "</chant>";
        children = walkChant($.load(meta)("chant"));
      } else {
        chant.type = "chant";
        chant.children = children = walkChant(el);
      }
      chant.id = children.shift()?.value;
      chant.volume = parseInt(children.shift()?.value);
      chant.part = parseInt(children.shift()?.value);
      children.shift(); // part title
      chant.title = _.unescape(children.shift()?.html);
      return cleanObject(chant);
    })
    .get()[0];
