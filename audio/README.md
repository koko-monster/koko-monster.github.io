# Landing-page narration

The landing page uses one natural-speed master per passage and changes playback
speed in the browser (0.8x, 1x, or 1.2x) with pitch preservation.

Voice: `ja-JP-NanamiNeural`
Output: 24 kHz, 160 kbps, mono MP3

To create all four passage tracks and ten vocabulary clips with an Azure
Speech resource:

```sh
export AZURE_SPEECH_KEY='your local key'
export AZURE_SPEECH_REGION='your resource region'
python3 scripts/generate_nanami_audio.py
```

Keep the key local. Do not paste it into chat or commit it. Track names, scripts,
and UI usage are defined in `voiceover-manifest.json`.
