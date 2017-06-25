const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
app.use((req, res, next)=> {
    const dotPosition = req.url.indexOf(".");
    if (dotPosition >= 0) {
        req.mapToPath = req.path.substring(0, dotPosition) + ".json";
    } else {
        req.mapToPath = req.path + ".json";
    }
    next();
});

app.use((req, res, next)=> {
    fs.readFile(path.join(__dirname, "test/mock/", req.mapToPath), (error, data)=> {
        res.header('Content-Type', 'application/json');
        if (error) {
            console.log("sorry ! An error occurred: " + error.message);
            res.send({resultCode: -1, description: 'service not found: ' + req.path});
        } else {
            const fileString = data.toString();
            try {
                var mockObject = JSON.parse(fileString);
                if (mockObject.method && mockObject.method.length && mockObject.method.some((item) => item.toUpperCase() === req.method.toUpperCase())) {
                    res.send(JSON.stringify(mockObject.data));
                } else {
                    res.send({
                        resultCode: -2,
                        description: `your request method is ${req.method} while ${mockObject.method} is required`
                    });
                }
            } catch (e) {
                res.send({resultCode: -3, description: 'server interval error:' + e.message});
            }
        }
        next();
    });
});

const server = app.listen(3000, ()=> {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Mock server listening at http://%s:%s', host, port);
});