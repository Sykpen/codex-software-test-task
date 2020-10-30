const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

const fs = require('fs')

const result =[];
const arrayOfCoordinates = [];
const ignoreList = new Set();
const dataFromFile = [];
const LINE_SYMBOL = 'x';
const INPUT_FILE = 'input.txt';
const OUTPUT_FILE = 'output.txt';
const EMPTY_LINE = '\n----------------------------------------\n';

require('fs').readFileSync(INPUT_FILE, 'utf-8').split(/\r?\n/).forEach(function(line){
  dataFromFile.push(line.split(' '));
});

 const validatePosition = (x, y) => {
    if(x > 0 && x <= result[0].length && y > 0 && y <= result.length) {
      return true
    }
 }

 const canvas = (width, height) => {
     for(let i = 0; i< height; i++) {
         result.push(new Array(width))
       for(let q = 0; q < width; q++) {
         result[i][q] = ' ';
       }
     }
     saveCurrentStateToFile()
  };
       
   const line = (x1, y1, x2, y2) => {
     if (!(validatePosition(x1, y1) && validatePosition(x2, y2))) {
      return console.log('Данная линия не является вертикальной или горизонтальной.')
     }
     if (result) {
       if (y1 === y2) {
         drowHorintalLine(y1, x1, x2)
         appendCurrentStateToFile()
       } else {
         drowVerticalLine(x1, y1, y2)
         appendCurrentStateToFile()
       }
     }
   };
   
   const drowHorintalLine = (y, x1, x2) => {
     for(let i = x1 - 1; i < x2; i++) {
       result[y - 1][i] = LINE_SYMBOL;
     }
   }
   
   const drowVerticalLine = (x, y1, y2) => {
     for(let i = y1 -1; i < y2; i++) {
       result[i][x - 1] = LINE_SYMBOL
     }
   }
   
   const rectangle = (x1, y1, x2, y2) => {
    if (!(validatePosition(x1, y1) && validatePosition(x2, y2))) {
      return console.log('Данный прямоугольник не может быть построен')
     }
     if(result) {
       drowHorintalLine(y1, x1, x2);
       drowHorintalLine(y2, x1, x2);
       drowVerticalLine(x1, y1, y2);
       drowVerticalLine(x2, y1, y2);
       appendCurrentStateToFile()
     }
   }
   
   const bucketFill = (x, y, c) => {
    if (!(validatePosition(x, y))) {
      return console.log('Данной точки не существует')
    }
     if(result) {
      buildCoordArr(x,y);
      fill(arrayOfCoordinates, c)
      appendCurrentStateToFile();
     }
   }

   const addEmptyLine= () => {
     fs.appendFileSync(
      OUTPUT_FILE,
      EMPTY_LINE,
       function (err) {
      if (err) return console.log(err);
    });
   }

   const appendCurrentStateToFile =() => {
    fs.appendFileSync(
      OUTPUT_FILE,
      result.map(function(v){ 
          return v.join(' ') 
         }).join('\n'),
       function (err) {
      if (err) return console.log(err);
    });
    addEmptyLine()
   }

   const saveCurrentStateToFile =() => {
    fs.writeFileSync(
      OUTPUT_FILE,
       result.map(function(v){ 
          return v.join(' ') 
         }).join('\n'),
       function (err) {
      if (err) return console.log(err);
    });
    addEmptyLine()
   }
   
   const buildCoordArr = (x, y) => {
    const position = `${x}:${y}`;
    let curentColor = result[y][x]
    if(x > 0 <= result[0].length && y > 0 <= result.length) {
      if (ignoreList.has(position)) {
        return;
      } else {
          ignoreList.add(position);
          arrayOfCoordinates.push([x,y]);
          if(y - 1 >= 0  && result[y-1][x] === curentColor) {
            buildCoordArr(x, y - 1)
          }
          if(x + 1 < result[0].length  && result[y][x+1] === curentColor) {
            buildCoordArr(x + 1, y)
          }
          if(x - 1 >= 0  && result[y][x-1] === curentColor) {
            buildCoordArr(x-1, y)
          }
          if(y + 1 < result.length  && result[y+ 1][x] === curentColor) {
            buildCoordArr(x, y + 1)
        }
      }
    }
  }
   
   const fill = (arrayOfCoordinates, color) => {
    arrayOfCoordinates.forEach(coordinates => {
       let x =  coordinates[0]
       let y =  coordinates[1]
       result[y][x] = color
     });
   }

 const makeFunctionsFromFile = (dataFromFile) => {
  dataFromFile.forEach(element => {
    if(element[0] === 'C') {
      canvas(parseInt(element[1]), parseInt(element[2]));
    } else if(element[0] === 'L') {
      line(parseInt(element[1]),parseInt(element[2]),parseInt(element[3]),parseInt(element[4])) ;
    } else if(element[0] === 'R') {
      rectangle(parseInt(element[1]),parseInt(element[2]),parseInt(element[3]),parseInt(element[4]));   
    } else if(element[0] === 'B') {
      bucketFill(parseInt(element[1]),parseInt(element[2]),element[3]);
    }
  });
}

makeFunctionsFromFile(dataFromFile)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/file', (req, res) => {
  console.log(result)
  res.send({ express: result });
});

app.listen(port, () => console.log(`Listening on port ${port}`));