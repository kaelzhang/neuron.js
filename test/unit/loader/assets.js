describe("Neuron: loader/assets", function(){


describe("NR.load.js(), which is also tested in neuron loader", function(){
    describe("NR.load.js(url)", function(){
        var js = '/lib/test/assets/load-js-url.js';
    
        it("will load a javascript into current page", function(){
            NR.load.js(js);
            
            var has_js = !!NR.DOM('script').get().map(function(script){
                     return script.src;
                
                }).filter(function(src){
                    return src && src.indexOf(js) !== -1;
                    
                }).length;
        
            expect(has_js).toBe(true);
        });
        
        it("will always returns the script node", function(){
            expect(NR.load.js(js).tagName.toLowerCase()).toBe('script');
        });
    });
    
    describe("semi-private: NR.load.js(url, callback)", function(){
        it("registering callback has compatible problem, never use this method for load status checking", function(){
            expect().toBe();
        });
    });
});

describe("NR.load.css()", function(){
    describe("NR.load.css(url)", function(){
        var css = '/lib/test/assets/load-css-url.css';
    
        it("will load a css file into current page", function(){
            NR.load.css(css);
            
            var has_css = !!NR.DOM('link').get().map(function(link){
                     return link.href;
                     
                }).filter(function(href){
                    return href && href.indexOf(css) !== -1;
                    
                }).length;
            
            expect(has_css).toBe(true);
        });
        
        it("will always returns the link node", function(){
            expect(NR.load.css(css).tagName.toLowerCase()).toBe('link');
        });
    });
});

describe("NR.load.img()", function(){
    var img = '/lib/test/assets/load-img-100x.png';

    describe("NR.load.img(url)", function(){
    
        it("will preload a image file, but it won't insert the image into the current page", function(){
            NR.load.img(img);
            
            var has_img = !!NR.DOM('img').get().map(function(img){
                     return img.src;
                     
                }).filter(function(src){
                    return src && src.indexOf(img) !== -1;
                    
                }).length;
            
            expect(has_img).toBe(false);
        });
        
        it("will always returns the image node", function(){
            expect(NR.load.img(img).tagName.toLowerCase()).toBe('img');
        });
    });
    
    describe("NR.load.img(url, callback)", function(){
        it("`this` object of callback will be the image node", function(){
            var self,
                ready;
                
            runs(function(){
                NR.load.img(img, function(name){
                    ready = true;
                    self = this;
                });
            });
            
            waitsFor(function(){
                return ready; 
            });
            
            runs(function(){
                expect(self.tagName.toLowerCase()).toBe('img');
            });
            
        });
        
        it("we could get the image size(100x100) by `this` object of the callback function", function(){
            var self,
                ready;
                
            runs(function(){
                NR.load.img(img, function(name){
                    ready = true;
                    self = this;
                });
            });
            
            waitsFor(function(){
                return ready; 
            });
            
            runs(function(){
                expect(parseInt(self.width)).toBe(100);
                expect(parseInt(self.height)).toBe(100);
            });
        });
    });
});

describe("NR.load", function(){
    var js = '/lib/test/assets/type-detect.js',
        css = '/lib/test/assets/type-detect.css',
        img = '/lib/test/assets/type-detect.png',
        js_img = '/lib/test/assets/type-detect.js.png',
        unknown = '/lib/test/assets/type-detect.unknown';

    describe("could automatically detect resouce type", function(){
        
    
        it("will load `xxx.js` file as javascript resource", function(){
            expect(NR.load(js).tagName.toLowerCase()).toBe('script');
        });
        
        it("will load `xxx.css` file as css resource", function(){
            expect(NR.load(css).tagName.toLowerCase()).toBe('link');
        });
        
        it("will load `xxx.png` file as image resource", function(){
            expect(NR.load(img).tagName.toLowerCase()).toBe('img');
        });
        
        it("will load a file with unknown extension as image resource by default", function(){
            expect(NR.load(unknown).tagName.toLowerCase()).toBe('img');
        });
    });
    
    describe("could force loading a resource as a specified type", function(){
        function NOOP(){};
    
        it("force all files as image", function(){
            expect(NR.load(js,  NOOP, 'img').tagName.toLowerCase()).toBe('img');
            expect(NR.load(css, NOOP, 'img').tagName.toLowerCase()).toBe('img');
            expect(NR.load(img, NOOP, 'img').tagName.toLowerCase()).toBe('img');
        });
        
        it("force all files as script", function(){
            expect(NR.load(js,  NOOP, 'js').tagName.toLowerCase()).toBe('script');
            expect(NR.load(css, NOOP, 'js').tagName.toLowerCase()).toBe('script');
            expect(NR.load(js_img, NOOP, 'js').tagName.toLowerCase()).toBe('script');
        });
        
        it("force all files as css", function(){
            expect(NR.load(js,  NOOP, 'css').tagName.toLowerCase()).toBe('link');
            expect(NR.load(css, NOOP, 'css').tagName.toLowerCase()).toBe('link');
            expect(NR.load(img, NOOP, 'css').tagName.toLowerCase()).toBe('link');
        });
    });
});
    
    
});