'use strict';

const fs = require('fs');

module.exports = {
    get(folder, deep) {
        return !deep ? this.root(folder) : this.deep(folder);
    },
    getSteps() {
        const steps = [];
        this.forEach('lib/assertions', () => false, (name) => steps.push(name));
        return steps;
    },
    forEach(path, excludeFn, fn) {
        let files = fs.readdirSync(path);
        for (let j = 0; j < files.length; j++) {
            let stats = fs.lstatSync(path + '/' + files[j]);
            let name = files[j].replace(/\.(html|js)/, '');
            if (stats.isDirectory() || excludeFn(name))
                continue;

            fn(name);
        }
    },
    deep(folder) {
        const steps = this.getSteps();
        const path = `${folder}/`;
        const students = {};
    
        const studentNames = fs.readdirSync(path);
        for (let i = 0; i < studentNames.length; i++) {
            let stats = fs.lstatSync(path + studentNames[i])
            if (stats.isFile())
                continue;
    
            students[studentNames[i]] = {score: 0, files: {}};
    
            this.forEach(path + studentNames[i], (name) => steps.indexOf(name) === -1, (name) => {
                students[studentNames[i]].files[name] = 0;
            });
        }
        return students;
    },
    root(folder) {
        const steps = this.getSteps();

        const path = `${folder}/`;
        const students = {'>': {score: 0, files: {}}};
        this.forEach(path, (name) => steps.indexOf(name) === -1, (name) => {
            students['>'].files[name] = 0;
        });

        return students;
    }
}
