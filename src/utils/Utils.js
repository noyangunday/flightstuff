class Utils {
    static getProperty(object, pathToProperty) {
        const path = pathToProperty.split(".");
        let obj = object;
        while(path.length > 1){
            obj = obj[path.shift()];
        }
        return obj[path.shift()];
    }
}

export default Utils;