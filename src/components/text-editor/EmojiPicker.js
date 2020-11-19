import React, { useState } from 'react';
import { emojiList } from '../data/emoji';

const EmojiPicker = ({
  quill,
  insertPos,
  closeFunc,
  recentlyUsedEmojis,
  setRecentlyUsedEmojis
}) => {
  const [selectedClass, setSelectedClass] = useState('Smileys');
  const insertEmoji = (e) => {
    const emojiToInsert = e.target.innerText;
    quill.insertText(insertPos, emojiToInsert);
    quill.focus();
    setRecentlyUsedEmojis([emojiToInsert,
      ...recentlyUsedEmojis.filter((emoji) => emoji !== emojiToInsert)]);
  }

  const handleSelectEmojiClass = (e) => {
    setSelectedClass(e.target.dataset.emojiClass);
  }

  return (
    <div className="emoji-picker">
      <ul className="emoji-classes">
        <li
          data-emoji-class="recently used emojis"
          className={selectedClass === 'recently used emojis' ?
            "emoji-class-item emoji-class-selected" :
            "emoji-class-item"}
          tabIndex={-1}
          onClick={handleSelectEmojiClass}
        >Recently Used</li>
        {Object.keys(emojiList).map((emojiClass, i) => (
          <li
            key={i}
            data-emoji-class={emojiClass}
            className={selectedClass === emojiClass ?
              "emoji-class-item emoji-class-selected" :
              "emoji-class-item"}
            tabIndex={-1}
            onClick={handleSelectEmojiClass}
          >
            {emojiClass}
          </li>
        ))}
      </ul>
      <div className="emoji-icons">
        {selectedClass === 'recently used emojis' ? (
          recentlyUsedEmojis.map((emojis, i) => (
            <span
              key={i}
              role="img"
              className="emoji-icon"
              onClick={insertEmoji}
            >{emojis}</span>
          ))
        ) :
          emojiList && emojiList[selectedClass].map((emojis, i) => (
            <span
              key={i}
              role="img"
              className="emoji-icon"
              onClick={insertEmoji}
            >{emojis}</span>
          ))}
      </div>
      <button
        type="button"
        // use an id instead of a class due to the css specificity
        id="close-emoji-picker-btn"
        onClick={closeFunc}
      >CLOSE</button>
    </div>
  );
}

export default EmojiPicker;
