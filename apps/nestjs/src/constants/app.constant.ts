export enum Environment {
  Local = "local",
  Development = "development",
  Staging = "staging",
  Production = "production",
  Test = "test",
}

export enum LogService {
  Console = "console",
  GoogleLogging = "google-logging",
  AwsCloudWatch = "aws-cloudwatch",
}

export enum Order {
  Asc = "asc",
  Desc = "desc",
}

export const loggingRedactPaths = [
  "req.headers.authorization",
  "req.body.token",
  "req.body.refreshToken",
  "req.body.email",
  "req.body.password",
  "req.body.oldPassword",
];

export const IS_PUBLIC = "is-public";
export const IS_AUTH_OPTIONAL = "is-auth-optional";

export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_CURRENT_PAGE = 1;
export const SYSTEM_USER_ID = "system";

export const GENIE_AGENT_HELPER = {
  text: "You are a helpful assistant that can help with tasks. You are going to help the user to summarize the given text. Analyze the given text and summarize it in a way that is easy to understand and use. Tonality will be given and the lenght of the summary",
  image:
    "You are a helpful assistant that can help with tasks. You are going to help the user to summarize the given image. Analyze the given image and summarize it in a way that is easy to understand and use. Tonality will be given and the lenght of the summary",
  video:
    "You are a helpful assistant that can help with tasks. You are going to help the user to summarize the given video. Analyze the given video and summarize it in a way that is easy to understand and use. Tonality will be given and the lenght of the summary",
  audio:
    "You are a helpful assistant that can help with tasks. You are going to help the user to summarize the given audio. Analyze the given audio and summarize it in a way that is easy to understand and use. Tonality will be given and the lenght of the summary",
  pdf: "You are a helpful assistant that can help with tasks. You are going to help the user to summarize the given pdf. Analyze the given pdf and summarize it in a way that is easy to understand and use. Tonality will be given and the lenght of the summary",
  url: "You are a helpful assistant that can help with tasks. You are going to help the user to summarize the given url. Analyze the given url and summarize it in a way that is easy to understand and use. Tonality will be given and the lenght of the summary",
};

export const MODEL_MAP_GENIE_AGENT = {
  text: "gpt-4o-mini",
  url: "gpt-4o-mini",
  pdf: "gpt-4o-mini",
  audio: "whisper-1",
  image: "gpt-4-vision-preview",
  video: "whisper-1 + gpt-4", // or gpt-4-vision for image frames
};

export const SummaryLength = {
  25: "Short",
  50: "Medium",
  75: "Long",
};

export const DEFAULT_MESSAGE =
  "In a quiet village nestled at the edge of an ancient forest, lived a little girl named Lila who was afraid of the dark. Every night, she would sleep with a lantern by her side, its dim light barely keeping the shadows away. One evening, during a power outage, Lila wandered outside searching for light. That’s when she saw it — a single glowing firefly dancing just beyond the trees. Curious and oddly comforted, she followed it deeper into the woods. The firefly led her to a hidden meadow, where thousands of fireflies lit up the night like stars. They swirled around her, warm and calm, chasing away her fear. In that moment, the darkness didn't feel empty — it felt alive. From that night on, Lila never feared the dark again. Instead, she welcomed it, hoping the fireflies would visit once more In a quiet village nestled at the edge of an ancient forest, lived a little girl named Lila who was afraid of the dark. Every night, she would sleep with a lantern by her side, its dim light barely keeping the shadows away. One evening, during a power outage, Lila wandered outside searching for light. That’s when she saw it — a single glowing firefly dancing just beyond the trees. Curious and oddly comforted, she followed it deeper into the woods. The firefly led her to a hidden meadow, where thousands of fireflies lit up the night like stars. They swirled around her, warm and calm, chasing away her fear. In that moment, the darkness didn't feel empty — it felt alive. From that night on, Lila never feared the dark again. Instead, she welcomed it, hoping the fireflies would visit once more.";

export const API_REQUEST = {
  FREE: 5,
  BASIC: 50,
};
