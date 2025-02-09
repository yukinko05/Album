"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { editAlbumTitle } from "@/services/albumService";

type Props = {
  albumId: string;
  currentTitle: string;
};

export default function EditAlbumTitle({ albumId, currentTitle }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [newTitle, setNewTitle] = useState<string>(currentTitle);

  const handleUpdate = async () => {
    try {
      await dispatch(
        editAlbumTitle({
          title: newTitle,
          albumId,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <button onClick={handleUpdate}>送信</button>
    </div>
  );
}
