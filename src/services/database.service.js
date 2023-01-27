import { BadFormatException } from '@/exceptions/bad-format.exception';

class DatabaseService {
  constructor() {
    this.database = null;
    this.databaseKeys = [];

    window.databaseService = this;
  }

  loadDatabase(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'utf-8');
      fileReader.onload = ({ target: { result } }) => {
        let objects = JSON.parse(result);
        // If it's not an array throw an error
        if (!Array.isArray(objects)) {
          return reject(new BadFormatException('Given JSON have a bad format!'));
        }
        this.database = objects;

        this.loadKeys();
        resolve();
      };
    });
  }

  loadKeys() {
    this.database.forEach(obj => {
      this.fillDatabaseKey(obj);
    });
  }

  fillDatabaseKey(obj, parentKey = null) {
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(objKey => {
        const key = parentKey !== null ? `${ parentKey }.${ objKey }` : objKey;
        if (typeof obj[objKey] !== 'object' && !Array.isArray(obj[objKey])) {
          if (!this.databaseKeys.includes(key)) {
            this.databaseKeys.push(key);
          }
        } else {
          this.fillDatabaseKey(obj[objKey], key);
        }
      });
    } else if (Array.isArray(obj)) {
      obj.forEach(o => {
        this.fillDatabaseKey(o, parentKey);
      });
    }
  }

  searchInKeys(value) {
    const regex = new RegExp(value, 'i');
    return this.databaseKeys.filter(k => regex.test(k));
  }
}


const databaseService = new DatabaseService();
export default databaseService;
