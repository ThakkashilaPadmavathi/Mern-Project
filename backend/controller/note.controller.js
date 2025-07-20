import Note from "../models/note.model.js";
import { errorHandler } from "../utils/error.js";

// ✅ Add Note
export const addNote = async (req, res, next) => {
  const { title, content, tags } = req.body;
  const { id } = req.user;

  if (!title) return next(errorHandler(400, "Title is required"));
  if (!content) return next(errorHandler(400, "Content is required"));

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: id,
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Edit Note
export const editNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return next(errorHandler(404, "Note not found"));

    if (req.user.id !== note.userId) {
      return next(errorHandler(403, "Unauthorized: Not your note"));
    }

    const { title, content, tags, isPinned } = req.body;

    if (!title && !content && !tags && typeof isPinned === "undefined") {
      return next(errorHandler(400, "No fields provided for update"));
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (typeof isPinned !== "undefined") note.isPinned = isPinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get All Notes
export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All notes retrieved successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete Note
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, userId: req.user.id });

    if (!note) return next(errorHandler(404, "Note not found"));

    await Note.deleteOne({ _id: req.params.noteId });

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Pin / Unpin Note
export const updateNotePinned = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) return next(errorHandler(404, "Note not found"));

    if (req.user.id !== note.userId) {
      return next(errorHandler(403, "Unauthorized: Not your note"));
    }

    const { isPinned } = req.body;

    if (typeof isPinned === "undefined") {
      return next(errorHandler(400, "isPinned field is required"));
    }

    note.isPinned = isPinned;
    await note.save();

    res.status(200).json({
      success: true,
      message: "Note pin status updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Search Notes
export const searchNote = async (req, res, next) => {
  const { query } = req.query;

  if (!query) return next(errorHandler(400, "Search query is required"));

  try {
    const matchingNotes = await Note.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Notes matching the search query retrieved successfully",
      notes: matchingNotes,
    });
  } catch (error) {
    next(error);
  }
};