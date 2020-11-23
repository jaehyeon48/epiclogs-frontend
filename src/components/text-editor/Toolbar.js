import React, { useState, useEffect } from 'react';
import Quill from 'quill';

import ColorPicker from './ColorPicker';
import EmojiPicker from './EmojiPicker'

const Toolbar = ({
  quill,
  closeFunc,
  isOpenEmojiPicker,
  insertPos
}) => {
  const [recentlyUsedEmojis, setRecentlyUsedEmojis] = useState([]);
  const icons = Quill.import('ui/icons');
  useEffect(() => {
    icons['code'] = `
    <svg viewbox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"></polyline>
      <polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"></polyline>
    </svg>`;
  }, []);

  return (
    <div id="editor-toolbar-container">
      <span className="ql-formats">
        <select className="ql-size" defaultValue="normal">
          <option value="small"></option>
          <option value="normal"></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-bold"
          title="bold"
        ></button>
        <button
          type="button"
          className="ql-italic"
          title="italic"
        ></button>
        <button
          type="button"
          className="ql-underline"
          title="underline"
        ></button>
        <button
          type="button"
          className="ql-strike"
          title="strike"
        ></button>
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-blockquote"
          title="blockquote"
        ></button>
        <button
          type="button"
          className="ql-code"
          title="inline code"
        ></button>
        <button
          type="button"
          className="ql-code-block"
          title="block code"
        ></button>
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-header" value="1"
          title="heading 1"
        ></button>
        <button
          type="button"
          className="ql-header" value="2"
          title="heading 2"
        ></button>
        <button
          type="button"
          className="ql-header" value="3"
          title="heading 3"
        >
          <svg viewBox="0 0 18 18">
            <path className="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z" />
          </svg>
        </button>
        <button
          type="button"
          className="ql-header" value="4"
          title="heading 4"
        >
          <svg viewBox="0 0 18 18">
            <path className="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm7.05371,7.96582v.38477c0,.39648-.165.60547-.46191.60547h-.47314v1.29785a.54085.54085,0,0,1-.605.60547h-.69336a.54085.54085,0,0,1-.605-.60547V12.95605H11.333a.5412.5412,0,0,1-.60547-.60547v-.15332a1.199,1.199,0,0,1,.22021-.748l2.56348-4.05957a.7819.7819,0,0,1,.72607-.39648h1.27637a.54085.54085,0,0,1,.605.60547v3.7627h.33008A.54055.54055,0,0,1,17.05371,11.96582ZM14.28125,8.7207h-.022a4.18969,4.18969,0,0,1-.38525.81348l-1.188,1.80469v.02246h1.5293V9.60059A7.04058,7.04058,0,0,1,14.28125,8.7207Z" />
          </svg>
        </button>
        <button
          type="button"
          className="ql-header" value="5"
          title="heading 5"
        >
          <svg viewBox="0 0 18 18">
            <path className="ql-fill" d="M16.74023,12.18555a2.75131,2.75131,0,0,1-2.91553,2.80566,3.908,3.908,0,0,1-2.25537-.68164.54809.54809,0,0,1-.13184-.8252L11.73438,13c.209-.34082.48389-.36328.8252-.1543a2.23757,2.23757,0,0,0,1.1001.33008,1.01827,1.01827,0,0,0,1.1001-.96777c0-.61621-.53906-.97949-1.25439-.97949a2.15554,2.15554,0,0,0-.64893.09961,1.15209,1.15209,0,0,1-.814.01074l-.12109-.04395a.64116.64116,0,0,1-.45117-.71484l.231-3.00391a.56666.56666,0,0,1,.62744-.583H15.541a.54085.54085,0,0,1,.605.60547v.43945a.54085.54085,0,0,1-.605.60547H13.41748l-.04395.72559a1.29306,1.29306,0,0,1-.04395.30859h.022a2.39776,2.39776,0,0,1,.57227-.07715A2.53266,2.53266,0,0,1,16.74023,12.18555ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z" />
          </svg>
        </button>
        <button
          type="button"
          className="ql-header" value="6"
          title="heading 6"
        >
          <svg viewBox="0 0 18 18">
            <path className="ql-fill" d="M14.51758,9.64453a1.85627,1.85627,0,0,0-1.24316.38477H13.252a1.73532,1.73532,0,0,1,1.72754-1.4082,2.66491,2.66491,0,0,1,.5498.06641c.35254.05469.57227.01074.70508-.40723l.16406-.5166a.53393.53393,0,0,0-.373-.75977,4.83723,4.83723,0,0,0-1.17773-.14258c-2.43164,0-3.7627,2.17773-3.7627,4.43359,0,2.47559,1.60645,3.69629,3.19043,3.69629A2.70585,2.70585,0,0,0,16.96,12.19727,2.43861,2.43861,0,0,0,14.51758,9.64453Zm-.23047,3.58691c-.67187,0-1.22168-.81445-1.22168-1.45215,0-.47363.30762-.583.72559-.583.96875,0,1.27734.59375,1.27734,1.12207A.82182.82182,0,0,1,14.28711,13.23145ZM10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Z" />
          </svg>
        </button>
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-list"
          value="ordered"
          title="numbered list"
        ></button>
        <button
          type="button"
          className="ql-list"
          value="bullet"
          title="unordered list"
        ></button>
        <select className="ql-align" title="align"></select>
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-script"
          value="sub"
          title="subscript"
        ></button>
        <button
          type="button"
          className="ql-script"
          value="super"
          title="superscript"
        ></button>
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-indent"
          value="-1"
          title="outdent"
        ></button>
        <button
          type="button"
          className="ql-indent"
          value="+1"
          title="indent"
        ></button>
      </span>
      <ColorPicker />
      <span className="ql-formats">
        <button
          type="button"
          className="ql-link"
          title="link"
        ></button>
        <button
          type="button"
          className="ql-image"
          title="image"
        ></button>
        <button
          type="button"
          className="ql-video"
          title="video"
        ></button>
        <button
          type="button"
          className="ql-emoji"
          title="emoji"
        ></button>
      </span>
      {isOpenEmojiPicker && (
        <EmojiPicker
          quill={quill}
          closeFunc={closeFunc}
          insertPos={insertPos}
          recentlyUsedEmojis={recentlyUsedEmojis}
          setRecentlyUsedEmojis={setRecentlyUsedEmojis}
        />
      )}
    </div>
  );
}

export default Toolbar;
