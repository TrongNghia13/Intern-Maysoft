import Helpers from "@src/commons/helpers";

const imageExtensions: { [key: string]: string } = {
    ".ai": "ai",
    ".bmp": "bmp",
    ".gif": "gif",
    ".ico": "ico",
    ".jpg": "jpg",
    ".jpeg": "jpeg",
    ".png": "png",
    ".ps": "ps",
    ".psd": "psd",
    ".svg": "svg",
    ".tif": "tif",
    ".tiff": "tiff",
    ".webp": "webp",
}

const videoExtensions: { [key: string]: string } = {
    ".3g2": ".3g2",
    ".3gp": ".3gp",
    ".avi": ".avi",
    ".flv": ".flv",
    ".h264": ".h264",
    ".m3u8": ".m3u8",
    ".m4v": ".m4v",
    ".mkv": ".mkv",
    ".mov": ".mov",
    ".mp4": ".mp4",
    ".mpg": ".mpg",
    ".rm": ".rm",
    ".swf": ".swf",
    ".ts": ".ts",
    ".vob": ".vob",
    ".webm": ".webm",
    ".wmv": ".wmv",
}

const isImageFile = (fileName: string): boolean => {
    return !Helpers.isNullOrEmpty(imageExtensions[Helpers.getFileExtesion(fileName)])
}

const isVideoFile = (fileName: string): boolean => {
    return !Helpers.isNullOrEmpty(videoExtensions[Helpers.getFileExtesion(fileName)])
}

const isDocumentFile = (fileName: string): boolean => {
    return !isImageFile(fileName) && !isVideoFile(fileName);
}

const FileHelpers = {
    isImageFile,
    isVideoFile,
    isDocumentFile    
}

export default FileHelpers;