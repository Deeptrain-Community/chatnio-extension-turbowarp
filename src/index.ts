import Extension from './include/plugin'
import { setKey, Chat } from 'chatnio'

let instance: Chat;

new Extension({
  id: 'chatnio',
  name: 'AI Chat',
  color1: '#2289fd',
  blocks: [{
    opcode: 'chat',
    blockType: 'reporter',
    text: 'Chat message [message:string] model [model:string] enable online searching [web:boolean]',
    default: { message: "hi", model: "gpt-3.5-turbo" },
    menu: {
      model: [
        // openai models
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-0613",
        "gpt-3.5-turbo-0301",
        "gpt-3.5-turbo-16k",
        "gpt-3.5-turbo-16k-0613",
        "gpt-3.5-turbo-16k-0301",
        "gpt-4",
        "gpt-4-0314",
        "gpt-4-0613",
        "gpt-4-32k",
        "gpt-4-32k-0314",
        "gpt-4-32k-0613",

        // anthropic models
        "claude-1",
        "claude-2",
        "claude-slack",

        // spark desk
        "spark-desk",

        // google palm2
        "chat-bison-001",

        // new bing
        "bing-creative",
        "bing-balanced",
        "bing-precise",

        // zhipu ai models
        "zhipu-chatglm-lite",
        "zhipu-chatglm-std",
        "zhipu-chatglm-pro",
      ]
    },
    bind: async (props) => {
      props.web = props.web || false;
      console.log(`[chatnio] got new message (message: ${props.message}, model: ${props.model}, web: ${props.web})`);

      return new Promise((resolve) => {
        let response = "";
        instance.askStream(props, function (message) {
          console.debug(`[chatnio] stream message received (message: ${message.message}, end: ${message.end})`);
          response += message.message;

          if (message.end) {
            console.debug(`[chatnio] stream end received`);
            resolve(response);
          }
        });
      });
    },
    disableMonitor: true,
  }, {
    opcode: 'set',
    blockType: 'command',
    text: 'Set Custom ApiKey [key:string]',
    default: { key: "sk-" },
    bind: async ({ key }) => {
      console.debug(`[chatnio] apikey has changed (key: ${key})`);
      setKey(key);
    }
  }, {
    opcode: 'website',
    blockType: 'command',
    text: 'Learn more',
    bind: () => { window.open("https://chatnio.net") }
  }],
  i18n: {
    source: 'en',
    accept: ['zh', 'en'],
  },
}).register(() => {
  instance = new Chat(-1);
});
