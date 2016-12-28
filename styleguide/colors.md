### Color Primitives
The existing Weaveworks palette consists of these colors:

| Sass Variable | Hex        | Sample     |
|-----------    |------------|------------|
| `$white`      | #fffff     |![alt text](https://dummyimage.com/20x20/ffffff/ffffff?text=%20)
| `$gray`       | #aaaaaa    |![alt text](https://dummyimage.com/20x20/aaaaaa/aaaaaa?text=%20)   
| `$lightgray`  | #d7d7d7    |![alt text](https://dummyimage.com/20x20/d7d7d7/d7d7d7?text=%20)    
| `$lavender`   | #8383ac    |![alt text](https://dummyimage.com/20x20/8383ac/8383ac?text=%20)     
| `$gunpowder`  | #3c3c5b    |![alt text](https://dummyimage.com/20x20/3c3c5b/3c3c5b?text=%20)    
| `$sand`       | #f5f4f4    |![alt text](https://dummyimage.com/20x20/f5f4f4/f5f4f4?text=%20)  
| `$athens`     | #e2e2ec    |![alt text](https://dummyimage.com/20x20/e2e2ec/e2e2ec?text=%20)

These variables are provided by the `weaveworks-ui-components` stylesheets and can be used to declare more meaninful local constants, like so:
```sass
$backgroundColor: $sand;
$textColor: $gunpowder;

body{
 color: $textColor;
 background-color: $backgroundColor;
}
```


Instructions on using stylesheets: https://github.com/weaveworks/ui-components#importing-styles

Color names were generated using this site: http://chir.ag/projects/name-that-color
