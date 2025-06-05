
import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import { Button } from '../ui/button';

const EMOJI_CATEGORIES = {
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  gestures: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊'],
  nature: ['🌱', '🌿', '🍀', '🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌾', '🌲', '🌳', '🌴', '🌵', '🌊', '🔥', '⭐', '🌟', '💫', '⚡'],
  food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠'],
  objects: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽']
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('faces');

  return (
    <div className="relative">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8"
      >
        <Smile className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72 z-50">
          <div className="flex space-x-1 mb-2">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
                className={`px-2 py-1 rounded text-xs capitalize ${
                  activeCategory === category 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
            {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  onEmojiSelect(emoji);
                  setIsOpen(false);
                }}
                className="p-1 hover:bg-gray-100 rounded text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
