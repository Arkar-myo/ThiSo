import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/utils/translations'
import { Eye, Download, Upload } from 'lucide-react'
// import { renderThiSo, handleDownload, handleSave } from '@/app/chordpro-editor/chordServices'
import { renderThiSo, handleDownload, handleSave } from './ChordServices'
import { Song } from '@/services/songService'
import { useAuth } from '@/contexts/AuthContext'

const ChordProEditor: React.FC<{ initialData: Song | null }> = ({ initialData }) => {
  const { language } = useLanguage()
  const { user } = useAuth()
  const t = translations[language]
  const [chordProInput, setChordProInput] = useState<string>(initialData?.body || '')
  const [songMetadata, setSongMetadata] = useState({
    title: initialData?.title || '',
    singer: initialData?.singer || '',
    songwriter: initialData?.writer || '',
    album: initialData?.album || '',
    key: initialData?.key || '',
    bpm: initialData?.tempo?.toString() || '',
  })
  const [isRenderError, setIsRenderError] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const [previewContent, setPreviewContent] = useState<{
    renderedLines: React.ReactNode,
    renderErrorFlg: boolean
  }>({ renderedLines: null, renderErrorFlg: false })

  useEffect(() => {
    if (initialData) {
      setChordProInput(initialData.body)
      setSongMetadata({
        title: initialData.title,
        singer: initialData.singer || '',
        songwriter: initialData.writer || '',
        album: initialData.album || '',
        key: initialData.key || '',
        bpm: initialData.tempo?.toString() || '',
      })
    }
  }, [initialData])

  useEffect(() => {
    const { renderedLines, renderErrorFlg }: any = renderThiSo({
      text: chordProInput,
      transpose: 0,
    })
    setPreviewContent({ renderedLines, renderErrorFlg })
    setIsRenderError(renderErrorFlg || false)
  }, [chordProInput])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChordProInput(e.target.value)
  }

  const handlePdfDownload = async () => {
    if (previewRef.current) {
      await handleDownload(previewRef.current, songMetadata.title)
    }
  }

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSongMetadata({
      ...songMetadata,
      [e.target.name]: e.target.value,
    })
  }

  const onSave = () => {
    const userId = user?.id
    const songDataWithUserId = {
      ...songMetadata,
      userId: userId
    }

    handleSave(songDataWithUserId, chordProInput, initialData?.id)
  }

  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="title"
                value={songMetadata.title}
                onChange={handleMetadataChange}
                placeholder="Song Title"
                className="border rounded-md p-2 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="singer"
                value={songMetadata.singer}
                onChange={handleMetadataChange}
                placeholder="Singer Name"
                className="border rounded-md p-2 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="songwriter"
                value={songMetadata.songwriter}
                onChange={handleMetadataChange}
                placeholder="Songwriter"
                className="border rounded-md p-2 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="album"
                value={songMetadata.album}
                onChange={handleMetadataChange}
                placeholder="Album Name"
                className="border rounded-md p-2 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                name="key"
                value={songMetadata.key}
                onChange={handleMetadataChange}
                placeholder="Key"
                className="border rounded-md p-2 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                name="bpm"
                value={songMetadata.bpm}
                onChange={handleMetadataChange}
                placeholder="Beats Per Minute (BPM)"
                className="border rounded-md p-2 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex gap-2 mb-4">
              {/* <Button onClick={handlePdfDownload} className="flex-grow sm:flex-grow-0">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button> */}
              <Button onClick={onSave}
                className="flex-grow sm:flex-grow-0"
                disabled={isRenderError}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            <Textarea
              value={chordProInput}
              onChange={handleInputChange}
              placeholder="Enter your ChordPro formatted text here..."
              className={`w-full h-[400px] font-mono ${isRenderError ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          <div
            ref={previewRef}
            className="border p-4 rounded-md min-h-[400px] bg-white dark:bg-gray-800 overflow-auto"
          >
            <div className="font-mono text-[14px] text-lg">
              {previewContent.renderedLines}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">How to Write a Song in ChordPro Format</h2>
          <ul className="list-disc list-inside space-y-2 dark:text-gray-300">
            <li>Use square brackets for chords: `[C]`, `[Am]`, `[F]`, `[G]`.</li>
            <li>Place chords directly before the syllable they’re played on.</li>
            <li>Use curly braces for section headers or directives like `{`start_of_intro`}`, `{`end_of_intro`}`, `{`soc: chorus`}`, etc.</li>
            <li>Common directives include `title`, `artist`, `album`, `key`, and `tempo`.</li>
            <li>Optional: Add base notes to chords using slash notation, like `[C/G]`.</li>
            <li>Use `/` to separate chords in progression or repeated measures.</li>
            <li>End each section with `{`eoc`}`, `{`eov`}`, or `{`eop`}` to indicate section closure.</li>
          </ul>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Example:</h3>
            <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white sm:p-6 lg:p-8">
              <pre className="overflow-x-auto whitespace-pre-wrap break-words">
                {`{start_of_intro: Intro}
[Dm] / [Am/C] / [G] / [G] / [F] / [C]
{end_of_intro}

{start_of_verse: Verse}
[C]An empty street, an [G]empty house  
[Em]A hole inside my [Am]heart  
[F]I'm all alone, the [F]rooms are getting [G]smaller  
{end_of_verse}

{sop: Pre Chorus}
And [F]oh, my [G]love  
I'm [C]holding on for[Am]ever  
{eop}

{soc: Chorus}
So I [F]say a little [C]prayer  
And hope my [F]dreams will take me [C]there  
Where the [F]skies are blue, to [C]see you [Am]once a[D]gain, my [G]love  
{eoc}`}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChordProEditor