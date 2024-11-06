import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { GState } from 'jspdf'
import { postSong, updateSong } from '../../services/songService'
import ChordSheetJS from "chordsheetjs"
import { Chord } from 'chordsheetjs';

export const handleUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  setChordProInput: React.Dispatch<React.SetStateAction<string>>,
  setSongMetadata: React.Dispatch<React.SetStateAction<{
    title: string;
    singer: string;
    songwriter: string;
    album: string;
    key: string;
    bpm: string;
  }>>
) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setChordProInput(text);
        // Parse metadata
        const metadataRegex = /\{(\w+):\s*(.+?)\}/g;
        const metadata: { [key: string]: string } = {};
        let match;
        while ((match = metadataRegex.exec(text)) !== null) {
          const key = match[1].toLowerCase();
          const value = match[2].trim();

          // Map ChordPro metadata to our metadata structure
          switch (key) {
            case 'title': metadata.title = value; break;
            case 'artist': metadata.singer = value; break;
            // case 'composer':
            case 'writer': metadata.songwriter = value; break;
            case 'album': metadata.album = value; break;
            case 'key': metadata.key = value; break;
            case 'tempo':
            case 'bpm': metadata.bpm = value; break;
          }
        }

        setSongMetadata({
          title: metadata.title || '',
          singer: metadata.singer || '',
          songwriter: metadata.songwriter || '',
          album: metadata.album || '',
          key: metadata.key || '',
          bpm: metadata.bpm || '',
        });
      }
    };
    reader.readAsText(file);
  }
}

export const renderThiSo = ({ text, transpose = 0, currentIndex = 0 }: any) => {
  // const parser = new ChordProParser();
  const parser = new ChordSheetJS.ChordProParser();

  try {
    if (!text || typeof text !== 'string') {
      return {
        renderedLines: [
          <p key="error" className="text-red-500">Please type the songs. The rendered lyrics will be displayed here.</p>
        ], renderErrorFlg: true,
      };
    }

    // const song = parser.parse(text);
    // if (transpose !== 0) song.transpose(transpose);
    let song: any;
    try {
      song = parser.parse(text);
      // return { song, error: null };
    } catch (error) {
      // Split text into lines and find the line causing the error
      const lines = text.split('\n');
      let errorLine = '';

      for (let i = 0; i < lines.length; i++) {
        try {
          parser.parse(lines[i]); // Attempt to parse each line individually
        } catch (lineError) {
          errorLine = lines[i];  // Capture the line causing the error
          break;
        }
      }

      return {
        renderedLines: [<p key="error" className="text-red-500">Error parsing chord sheet at `{errorLine}`</p>],
        renderErrorFlg: true
      };
    }

    const renderedLines: any[] = [];
    let isInChordOnlyPart = false;
    let isInLyricChordpart = false;

    const renderLine = (line: any, lineIndex: any) => {
      const isCurrentLine = lineIndex === currentIndex;
      return (
        <div
          key={lineIndex}
          className={`relative ${line.type === 'chorus'
            ? 'bg-gray-100 dark:bg-gray-700 p-2 pb-0 pt-0'
            : 'p-2 pb-0 pt-0'} 
            flex flex-wrap`}
        >
          {line.items.map((item: any, index: any) => (
            <div key={index} className="relative flex flex-col items-center mr-1">
              {line.type && item?._value && (
                <span
                  className={`font-bold absolute ${item._originalName === 'comment' ? 'text-gray-400' : 'text-blue-500'}`}
                  style={{
                    left: `1em`,
                    top: '-1.5em', // Adjusted from -1.2em to -1.5em for better vertical alignment
                    whiteSpace: 'nowrap',
                    transform: 'translateX(-25%)', // Added to center the chord above the syllable
                    marginTop: '2em',
                    width: item._originalName === 'comment' ? '100%' : 'auto',
                    textOverflow: item._originalName === 'comment' ? 'clip' : 'ellipsis',
                    overflow: item._originalName === 'comment' ? 'visible' : 'hidden',
                  }}
                // className="text-blue-500 font-bold"
                >
                  {item._value || ' '}{item._originalName === 'comment' ? '' : ':'}
                </span>
              )}
              {item.chords && (
                <span
                  className="text-blue-500 font-bold absolute"
                  style={{
                    left: `${!isInChordOnlyPart ? item.lyrics.length * 0.1 : -0.8}em`,
                    // left: `${item.lyrics.length * 0.1}em`,
                    // top: '-1.5em', // Adjusted from -1.2em to -1.5em for better vertical alignment
                    top: `${!isInChordOnlyPart ? -1.5 : -0.3}em`, // Adjusted from -1.2em to -1.5em for better vertical alignment
                    whiteSpace: 'nowrap',
                    transform: 'translateX(-25%)', // Added to center the chord above the syllable
                    marginTop: `${!isInChordOnlyPart ? 1.5 : 0.5}em`,
                    // marginTop: `1.5em`,
                    // marginRight: `${!isInChordOnlyPart ? 0: }em`,
                  }}
                // className="text-blue-500 font-bold"
                >
                  {Chord.parse(item.chords)?.transpose(transpose).toString() || ' '}

                </span>
              )}
              <span
                className="text-gray-800 dark:text-gray-100"
                style={{
                  marginTop: `${!isInChordOnlyPart ? 1.5 : 0.5}em`, // Increased from 1.5em to 2em to accommodate chord positioning
                  // marginTop: `1.5em`, // Increased from 1.5em to 2em to accommodate chord positioning
                  marginBottom: '0.3em',
                  lineHeight: '1em',
                  position: 'relative'
                }}
              >
                {item.lyrics || ' '}
                {
                  !item?._name &&
                  <>&nbsp;</>
                }
              </span>
            </div>
          ))}
        </div>
      );
    };

    song.lines.forEach((line: any, lineIndex: any) => {
      console.log(line)
      const directive = line.items[0]?._name;
      const annotation = line.items[0]?.annotation;
      const chordStartDirectives: string[] = [
        'start_of_intro', 'soi',
        'start_of_solo', 'sos',
        'start_of_music', 'som',
        // 'start_of_pre', 'sop',
        // 'start_of_bridge', 'sob'
      ]
      const chordEndDirectives: string[] = [
        'end_of_intro', 'eoi',
        'end_of_solo', 'eos',
        'end_of_music', 'eom',
        // 'end_of_pre', 'eop',
        // 'end_of_bridge', 'eob'
      ]

      const lyricChordStartDir: string[] = [
        'start_of_pre', 'sop',
        'start_of_bridge', 'sob'
      ]

      const lyricChordEndDir: string[] = [
        'end_of_pre', 'eop',
        'end_of_bridge', 'eob'
      ]

      if (directive) {
        if (chordStartDirectives.some(eachDir => eachDir === directive)) {
          isInChordOnlyPart = true;
        } else if (chordEndDirectives.some(eachDir => eachDir === directive)) {
          isInChordOnlyPart = false;
        } else if (lyricChordStartDir.some(eachDir => eachDir === directive)) {
          isInLyricChordpart = true;
        } else if (lyricChordEndDir.some(eachDir => eachDir === directive)) {
          isInLyricChordpart = false;
        }
      }

      if (annotation) {
        renderedLines.push(
          <p
            key={`section-${lineIndex}`}
            className="text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-700 font-semibold px-2 py-1 rounded mt-4 mb-2"
          >
            [{annotation}]
          </p>
        );
      } else if (line.hasRenderableItems() || isInChordOnlyPart || isInLyricChordpart) {
        renderedLines.push(renderLine(line, lineIndex));
      }
    });

    return {
      renderedLines,
      renderErrorFlg: false
    };
  } catch (error) {
    // console.error('Error parsing chord sheet:', error);
    return {
      renderedLines: [<p key="error" className="text-red-500">Error parsing chord sheet</p>],
      renderErrorFlg: true
    };
  }
};

export const handleDownload = async (element: HTMLElement, title: string) => {
  const canvas = await html2canvas(element)
  const imgData = canvas.toDataURL('image/png')

  // Create PDF with A4 size
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Add the captured content
  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)

  // Add watermark
  pdf.setFontSize(20)
  pdf.setGState(new GState({ opacity: 0.1 }))

  // Add MusicIcon as SVG
  const musicIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'

  // Add watermark multiple times
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 8; j++) {
      pdf.addSvgAsImage(musicIconSvg, 10 + i * 40, 10 + j * 40, 20, 20)
      pdf.text('ThiSo', 15 + i * 40, 25 + j * 40)
    }
  }

  pdf.setGState(new GState({ opacity: 1 }))

  // Save the PDF
  pdf.save(`${title || 'song'}.pdf`)
}

export const handleSave = async (metadata: any, chordProInput: string, songId?: string) => {
  try {
    // const { user } = useAuth()
    const songData = {
      title: metadata.title,
      singer: metadata.singer,
      writer: metadata.songwriter,
      album: metadata.album,
      key: metadata.key,
      tempo: metadata.bpm ? parseInt(metadata.bpm) : null,
      body: chordProInput,
      userId: metadata.userId
    };

    if (songId) {
      await updateSong(songId, songData);
    } else {
      await postSong(songData);
    }

    // Redirect to songs list after successful save
    window.location.href = '/song-list';
  } catch (error) {
    console.error('Error saving song:', error);
    throw new Error('Failed to save song');
  }
};
