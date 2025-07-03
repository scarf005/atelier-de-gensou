import {
  ImageMagick,
  IMagickImage,
  initialize,
  MagickGeometry,
} from "https://deno.land/x/imagemagick_deno/mod.ts"
import { Command } from "@cliffy/command"

await initialize()

const { args: [image], options: { width, density, brightness } } = await new Command()
  .name("to-ascii")
  .description("이미지를 ASCII 아트로 변환합니다")
  .option("-W --width <width:number>", "ASCII 아트의 너비", { default: 80 })
  .option("-B --brightness <brightness:number>", "밝기 배율", { default: 1 })
  .option("--density <density:string>", "밝기를 표현할 문자열", {
    default:
      "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'.            " as string,
  })
  .arguments("<image:string>")
  .parse(Deno.args)

const data = await Deno.readFile(image)

ImageMagick.read(data, (img: IMagickImage) => {
  img.grayscale()
  img.resize(width, width)

  const geometry = new MagickGeometry(img.width, img.height / 2)
  geometry.ignoreAspectRatio = true

  img.resize(geometry)

  img.getPixels((pixels) => {
    const getChar = (pixel: Uint8Array) => {
      const idx = Math.min(
        Math.floor((pixel[0] / 255 * brightness) * (density.length - 1)),
        density.length - 1,
      )
      return density[idx]
    }

    const asciiArt = Array.from(
      { length: img.height },
      (_, y) =>
        Array.from({ length: img.width }, (_, x) => getChar(pixels.getPixel(x, y))).join(""),
    ).join("\n")

    console.log(asciiArt)
  })
})
