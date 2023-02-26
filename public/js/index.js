

function bufferToArray (buffer = new ArrayBuffer()) {
    const readedBuffer = new Uint8Array(buffer);
    const bytes = [];
    for (const byte of readedBuffer) bytes.push(byte);
    return bytes;
}

function GetDataOfFile (file = new File([], '', { })) {
    const fileReader = new FileReader();
    
    return new Promise((resolve, reject) => {
        const handleEvent = ({ name, event }) => {
            if (name != 'end') return reject();

            try {
                resolve({
                    name: file.name,
                    lastModified: file.lastModified,
                    size: file.size,

                    content: {
                        type: file.type,
                        binary: bufferToArray(event.target.result)
                    }
                });
            }

            catch (error) {
                return reject(error);
            }
        }
    
        fileReader.onabort = (event) => handleEvent({ name: 'abort', event });
        fileReader.onerror = (event) => handleEvent({ name: 'error', event });
        fileReader.onloadend = (event) => handleEvent({ name: 'end', event });

        fileReader.readAsArrayBuffer(file);
    })
}

async function ReadFiles (target = new HTMLInputElement()) {
    const files = [];

    for (const file of target.files) {
        try {
            const fileData = await GetDataOfFile(file);
            files.push(fileData);
        } 

        catch (error) {
            console.error(`failure input file: ${file.name}`, error);
        }
    }

    return files;
}

function toHex(bytes = []) {
    return bytes.map(a => (`000${a.toString(16)}`).slice(-2)).join('').toUpperCase();
}

async function sendFiles({ name, lastModified, size, content: { type, binary } }) {
    const request = new AppRequest();
    const { data: { uuid } } = await request.get({ url: '/upload', data: { type } });
    const totalPack = Math.floor((size / 10));
    let count = 0;
    const packs = [];

    while (count < size) {
        if ((count + totalPack) > size) {
            packs.push(binary.slice(count));
        }

        else {
            packs.push(binary.slice(count, count + totalPack));
        }

        count = (count + totalPack);
    }

    for (let x = 0; x < packs.length; x++) {
        await request.post({ 
            url: '/upload', 
            data: { 
                uuid, 
                content: { 
                    size: x, 
                    totalSize: packs.length, 
                    buffer: packs[x],
                    verify: toHex(
                        bufferToArray(
                            await window.crypto.subtle.digest('SHA-512', new Uint8Array(packs[x]))
                        )
                    )
                }
            } 
        })
    }
}




async function SubmitInput(event = new MouseEvent()) {
    const readedFiles = await ReadFiles(input);

    for (const fileData of readedFiles) 
        try {
            sendFiles(fileData);
        }

        catch (error) {
            console.error(error);
        }
    // const bytes = [];
    // const text = 'test_send_file';
    // for (let x = 0; x < text.length; x++) bytes.push(text.charCodeAt(x));
    // const uint = new Uint8Array(bytes);
    // const hashed = await window.crypto.subtle.digest('SHA-512', uint.buffer);

    // console.log(toHex(bufferToArray(hashed)));
    // sendFiles({ content: { type: 'image/jpg' } });
    
    // console.log(readedFiles);
}
