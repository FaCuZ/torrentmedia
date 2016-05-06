# nw-dialog
File and Folder dialog for NWJS and Node Webkit

## Installation
Use Node mode

`npm install nw-dialog -S`


```JavaScript
var dialog = require('nw-dialog')
dialog.setContext(document) // work in client
dialog.openFileDialog( ... )
```

Use Client mode

```JavaScript
<script src="nw-dialog/index.js"></script>
nw.Dialog.openFileDialog( ... ) 
// or
window.dialog.openFileDialog( ... )
```

## Example
#### OpenFileDialog
Simple 

```JavaScript
dialog.openFileDialog(function(result) {
    alert(result)
})
```

With file type

```JavaScript
dialog.openFileDialog('.zip,.rar', function(result) {
    alert(result)
})
```
or

```JavaScript
dialog.openFileDialog(['.zip', '.rar'], function(result) {
    alert(result)
})
```

Multiple select

```JavaScript
dialog.openFileDialog(true, function(result) {
    alert(result)
})
```

File type + Multiple select

```JavaScript
dialog.openFileDialog('.zip,.rar', true, function(result) {
    alert(result)
})
```

File type + Working directory

```JavaScript
dialog.openFileDialog('.zip,.rar', '/Users/didanurwanda', function(result) {
	alert(result)
})
```

File type + Multiple select + Working directory

```JavaScript
dialog.openFileDialog('.zip,.rar', true, '/Users/didanurwanda', function(result) {
	alert(result)
})
```

### SaveFileDialog
Simple

```JavaScript
dialog.saveFileDialog(function(result) {
    alert(result)
})
```

File name

```JavaScript
dialog.saveFileDialog('name.txt', function(result) {
    alert(result)
})
```

With extension

```JavaScript
dialog.saveFileDialog('name', '.txt,.srt', function(result) {
    alert(result)
})
```
or

```JavaScript
dialog.saveFileDialog('name', ['.txt', '.srt'], function(result) {
    alert(result)
})
```

Working directory

```JavaScript
dialog.saveFileDialog('name', '.txt', '/Users/didanurwanda', function(result) {
    alert(result)
})
```

### FolderBrowserDialog
Simple

```JavaScript
dialog.folderBrowserDialog(function(result) {
    alert(result)
})
```

Default Directory

```JavaScript
dialog.folderBrowserDialog('/Users/didanurwanda', function(result) {
    alert(result)
})
```