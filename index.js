import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const api_key = '_THhEpo2NC4zakQ3pc99D5aiiBOy5RFN';
const user_key = 'a327beeca464f9db874c8b03fc5dbed8';
const getPasteKeys = async () => {
  const formData = new URLSearchParams();
  formData.append('api_dev_key', api_key);
  formData.append('api_user_key', user_key);
  formData.append('api_option', 'list')
  const response = await axios.request({ url: 'https://pastebin.com/api/api_post.php', 
    method: 'POST',headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: formData
  })
  const parser = new XMLParser();
  return parser.parse(response.data).paste.map(({ paste_key }) => paste_key);
}

const getRawPaste = async (key) => {
  const response = await axios.request({ url: `https://pastebin.com/raw/${key}` });
  return response.data.split('\r\n');
};

(async function main() {
  const pasteKeys = await getPasteKeys();
  const idBatches = await Promise.all(pasteKeys.map(key => getRawPaste(key)));
  const idSet = new Set();
  idBatches.forEach(idBatch => {
    idBatch.forEach(id => {
      if (idSet.has(id)) {
        console.log('found collision: ', id);
        return;
      }
      idSet.add(id);
    });
  });
  console.log('done checking');
})()
