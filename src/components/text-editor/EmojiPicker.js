import React, { useState } from 'react';
import { emojiList } from '../data/emojiList';

const EmojiPicker = ({
  quill,
  insertPos,
  closeFunc,
  recentlyUsedEmojis,
  setRecentlyUsedEmojis
}) => {
  const [selectedClass, setSelectedClass] = useState('Activities');
  const insertEmoji = (emojiObj) => {
    quill.clipboard.dangerouslyPasteHTML(insertPos.index, emojiObj.html);
    quill.focus();
    setRecentlyUsedEmojis([emojiObj,
      ...recentlyUsedEmojis.filter((prevEmojiObj) => prevEmojiObj.unicode !== emojiObj.unicode)]);
  }

  const handleSelectEmojiClass = (emojiClass) => {
    setSelectedClass(emojiClass);
  }

  return (
    <div className="emoji-picker">
      <ul className="emoji-classes">
        <li
          className={selectedClass === 'recently used emojis' ?
            "emoji-class-item emoji-class-selected" :
            "emoji-class-item"}
          tabIndex={-1}
          onClick={() => handleSelectEmojiClass('recently used emojis')}
        >Recently Used</li>
        {Object.keys(emojiList).map((emojiClass, i) => (
          <li
            key={i}
            data-emoji-class={emojiClass}
            className={selectedClass === emojiClass ?
              "emoji-class-item emoji-class-selected" :
              "emoji-class-item"}
            tabIndex={-1}
            onClick={() => handleSelectEmojiClass(emojiClass)}
          >
            {emojiClass}
          </li>
        ))}
      </ul>
      <div className="emoji-icons">
        {selectedClass === 'recently used emojis' ? (
          recentlyUsedEmojis && recentlyUsedEmojis.map((emojiObj) => (
            <span
              key={emojiObj.unicode}
              title={emojiObj.name}
              role="img"
              aria-label={emojiObj.name}
              className="emoji-icon"
              onClick={() => insertEmoji(emojiObj)}
            >{emojiObj.emoji}</span>
          ))
        ) :
          emojiList && emojiList[selectedClass].map((emojiObj, i) => (
            <span
              key={i}
              title={emojiObj.name}
              role="img"
              aria-label={emojiObj.name}
              className="emoji-icon"
              onClick={() => insertEmoji(emojiObj)}
            >{emojiObj.emoji}</span>
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
