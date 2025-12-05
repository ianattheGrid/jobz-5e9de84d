import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Video, Image, Link } from "lucide-react";
import { ShowAndTellItem } from "./types";
import { CHAR_LIMITS, MAX_SHOW_AND_TELL_ITEMS } from "./constants";

interface ShowAndTellBlockProps {
  items: ShowAndTellItem[];
  onChange: (items: ShowAndTellItem[]) => void;
}

export function ShowAndTellBlock({ items, onChange }: ShowAndTellBlockProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ShowAndTellItem>>({
    type: 'link',
    title: '',
    url_or_path: '',
    short_description: '',
  });

  const handleAdd = () => {
    if (newItem.title && newItem.url_or_path && newItem.type) {
      onChange([
        ...items,
        {
          title: newItem.title.slice(0, CHAR_LIMITS.show_and_tell_title),
          type: newItem.type as ShowAndTellItem['type'],
          url_or_path: newItem.url_or_path,
          short_description: (newItem.short_description || '').slice(0, CHAR_LIMITS.show_and_tell_description),
        },
      ]);
      setNewItem({ type: 'link', title: '', url_or_path: '', short_description: '' });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const getTypeIcon = (type: ShowAndTellItem['type']) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900">Show & Tell (Optional)</h4>
        <p className="text-sm text-gray-600">
          Add up to {MAX_SHOW_AND_TELL_ITEMS} examples of things you've made or done ({items.length}/{MAX_SHOW_AND_TELL_ITEMS})
        </p>
      </div>

      {/* Existing items */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border bg-pink-50 border-pink-200"
            >
              <div className="flex-shrink-0 p-2 bg-white rounded-md text-pink-600">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                {item.short_description && (
                  <p className="text-xs text-gray-600 truncate">{item.short_description}</p>
                )}
                <a
                  href={item.url_or_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-600 hover:underline truncate block"
                >
                  {item.url_or_path}
                </a>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add new item form */}
      {isAdding ? (
        <div className="space-y-3 p-4 rounded-lg border border-pink-200 bg-pink-50/50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Type</Label>
              <Select
                value={newItem.type}
                onValueChange={(value) => setNewItem({ ...newItem, type: value as ShowAndTellItem['type'] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Title</Label>
              <Input
                placeholder="e.g., Intro video"
                value={newItem.title || ''}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value.slice(0, CHAR_LIMITS.show_and_tell_title) })}
                maxLength={CHAR_LIMITS.show_and_tell_title}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm">URL or Link</Label>
            <Input
              placeholder="https://..."
              value={newItem.url_or_path || ''}
              onChange={(e) => setNewItem({ ...newItem, url_or_path: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm">Short description (optional)</Label>
            <Input
              placeholder="Brief description..."
              value={newItem.short_description || ''}
              onChange={(e) => setNewItem({ ...newItem, short_description: e.target.value.slice(0, CHAR_LIMITS.show_and_tell_description) })}
              maxLength={CHAR_LIMITS.show_and_tell_description}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {(newItem.short_description || '').length}/{CHAR_LIMITS.show_and_tell_description}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!newItem.title || !newItem.url_or_path}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Add Item
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewItem({ type: 'link', title: '', url_or_path: '', short_description: '' });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        items.length < MAX_SHOW_AND_TELL_ITEMS && (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full border-dashed border-pink-300 text-pink-600 hover:bg-pink-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add an example
          </Button>
        )
      )}
    </div>
  );
}
