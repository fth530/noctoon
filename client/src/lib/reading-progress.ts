// Reading Progress Helper Functions
// Stores which chapter user last read for each series

const READING_PROGRESS_KEY = "noctoon-reading-progress";

export interface ReadingProgress {
    seriesId: string;
    chapterId: string;
    chapterNumber: number;
    chapterTitle: string;
    lastReadAt: string;
}

// Get all reading progress
export function getAllReadingProgress(): Record<string, ReadingProgress> {
    try {
        const stored = localStorage.getItem(READING_PROGRESS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

// Get reading progress for a specific series
export function getReadingProgress(seriesId: string): ReadingProgress | null {
    const progress = getAllReadingProgress();
    return progress[seriesId] || null;
}

// Save reading progress
export function saveReadingProgress(
    seriesId: string,
    chapterId: string,
    chapterNumber: number,
    chapterTitle: string
): void {
    const progress = getAllReadingProgress();
    progress[seriesId] = {
        seriesId,
        chapterId,
        chapterNumber,
        chapterTitle,
        lastReadAt: new Date().toISOString()
    };
    localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(progress));
}

// Clear reading progress for a series
export function clearReadingProgress(seriesId: string): void {
    const progress = getAllReadingProgress();
    delete progress[seriesId];
    localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(progress));
}
