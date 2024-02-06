const { program } = require('commander');
const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const PDFMerger = require('pdf-merger-js');

program
  .option('-s, --source <path>', 'Path to the source HTML file')
  .option('-d, --data <fieldA:valueA|fieldB:valueB>', 'Data to be injected into the HTML file')
  .option('-a, --append <path>', 'Path to a file an existing PDF file to append to the generated PDF')
  .option('-f, --filename <name>', 'Name of the generated PDF file')

program.parse();

const options = program.opts();
const filename = `./output/${options.filename || 'result.pdf'}`;
const { source, data, append } = options;
const fields = {}

if (!source) {
  throw new Error('Source file is required');
}

if (data) {
  data.split('|').forEach((pair) => {
    const [field, value] = pair.split(':');
    fields[field] = value;
  });

}

const makePdf = (html) => {
  const pdfOptions = {
    format: 'A4',
    orientation: 'portrait',
    border: '1in',
    header: {
      height: '0.3in',
      content: '',
    },
  }

  const document = {
    html,
    path: filename,
    data: fields,
    type: '',
  };

  console.log('📃 Generating source PDF ...');

  pdf.create(document, pdfOptions)
    .then((res) => {
      console.log('✅ Source PDF done!');
      if (append) {
        console.log('📄 Merging with an existing PDF...');

        const merger = new PDFMerger();
        merger.add(res.filename);
        merger.add(append);

        merger.save(filename)
          .then(() => {
            console.log('🎉 Merged with an existing PDF!');
          })
          .catch((e) => {
            console.error(e);
          })
      }
    })
    .catch((e) => {
      console.error(e);
    });
}

const generate = () => {
  console.log('🦘 Setting up template...')
  fs.readFile(source, 'utf8', (err, html) => {
    if (err) {
      console.error(err);
      return;
    }

    makePdf(html);
  });
}

const cleanup = () => {
  const directory = './output';

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}

cleanup();

generate()