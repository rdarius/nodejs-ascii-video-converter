# ASCII Video Converter

## Prerequisites

```
    - nodejs: https://nodejs.org/en/download/
    - ffmpeg: https://www.ffmpeg.org/download.html
```

## Commands

### Options

    - input-file
        - file to be converted (original is kept)
        - default: input.mp4/input.gif/input.png depending on command used

    - output-file
        - file to save the converted file
        - default: input.mp4/input.gif/input.png depending on command used

    - pixel-size
        - size of ASCII character (output resolution will be multipied by this amount, downscaling is recomended)
        - default: 24

    - font-size-modifier
        - increase ASCII character size by set pixes without increasing space it takes. Could be useful when using bigger pixel-size setting
        - default: 4

    - scaled-size
        - pixels in width (result will be scaled-size * pixel-size of width)
        - default: 120

    - fps
        - frames per second of generated file
        - default: 10

### Convert GIF to ASCII GIF

`npm run convert:gif:gif [input-file] [output-file] [pixel-size] [font-size-modifier] [scaled-size] [fps]`

### Convert GIF to ASCII MP4

`npm run convert:gif:mp4 [input-file] [output-file] [pixel-size] [font-size-modifier] [scaled-size] [fps]`

### Convert MP4 to ASCII MP4

`npm run convert:mp4:mp4 [input-file] [output-file] [pixel-size] [font-size-modifier] [scaled-size] [fps]`

### Convert MP4 to ASCII GIF

`npm run convert:mp4:gif [input-file] [output-file] [pixel-size] [font-size-modifier] [scaled-size] [fps]`

### Convert PNG to ASCII PNG

`npm run convert:img [input-file] [output-file] [pixel-size] [font-size-modifier] [scaled-size]`


Contributing to pointless projects made with JavaScript :3