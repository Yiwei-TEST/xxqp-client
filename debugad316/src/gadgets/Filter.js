/**
 * Created by kenkozheng  on 2014/12/9.15:15
 * Note:只能用于控制Sprite的色调等，目标是实现类似Flash的内置基本滤镜
 * 静态类
 * modified by    jsroads
 * E-mail: jsroads@163.com
 */
var Filter = {
    DEFAULT_VERTEX_SHADER:
    "attribute vec4 a_position; \n"
    + "attribute vec2 a_texCoord; \n"
    + "varying mediump vec2 v_texCoord; \n"
    + "void main() \n"
    + "{ \n"
    + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
    + "    v_texCoord = a_texCoord; \n"
    + "}",
    GRAY_SCALE_FRAGMENT_SHADER:
    "varying vec2 v_texCoord;   \n"
    + "uniform sampler2D tex0; \n"
    + "void main() \n"
    + "{  \n"
    + "    vec4 texColor = texture2D(tex0, v_texCoord);  \n"
    + "    float gray = texColor.r * 0.299 + texColor.g * 0.587 + texColor.b * 0.114; \n"
    + "    gl_FragColor = vec4(gray, gray, gray, texColor.a);  \n"
    + "}",
    SHADER_POSITION_GRAY_FRAG:
    "varying vec4 v_fragmentColor;\n"+
    "varying vec2 v_texCoord;\n"+
    ((typeof document !== 'undefined')? "uniform sampler2D CC_Texture0;\n":"")+
    "void main()\n"+
    "{\n"+
    "    vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n"+
    "    float gray = dot(v_orColor.rgb, vec3(0.299, 0.587, 0.114));\n"+
    "    gl_FragColor = vec4(gray, gray, gray, v_orColor.a);\n"+
    "}\n",

    SHADER_POSITION_NORMAL_FRAG:
    "varying vec4 v_fragmentColor;\n"+
    "varying vec2 v_texCoord;\n"+
    "void main()\n"+
    "{\n"+
    "    vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n"+
    "    float gray = dot(v_orColor.rgb, vec3(0.299, 0.587, 0.114));\n"+
    "    gl_FragColor = vec4(v_orColor.r, v_orColor.g, v_orColor.b, v_orColor.a);\n"+
    "}\n",

    SHADER_POSITION_GRAY_VERT :
    "attribute vec4 a_position;\n"+
    "attribute vec2 a_texCoord;\n"+
    "attribute vec4 a_color;\n"+
    "\n"+
    "varying vec4 v_fragmentColor;\n"+
    "varying vec2 v_texCoord;\n"+
    "\n"+
    "void main()\n"+
    "{\n"+
    "gl_Position = "+ ((typeof document !== 'undefined')?"(CC_PMatrix * CC_MVMatrix)":"CC_PMatrix") + " * a_position;\n"+
    "v_fragmentColor = a_color;\n"+
    "v_texCoord = a_texCoord;\n"+
    "}",

    programs:{},

    /**
     * 灰度
     * @param sprite
     */
    grayScale: function (sprite) {
        var program = Filter.programs["grayScale"];
        if(!program){
            program = new cc.GLProgram();
            program.initWithString(Filter.SHADER_POSITION_GRAY_VERT, Filter.SHADER_POSITION_GRAY_FRAG);
            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);        //cocos会做初始化的工作
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            Filter.programs["grayScale"] = program;
        }
        gl.useProgram(program.getProgram());
        sprite.shaderProgram = program;
    },

    normalScale: function (sprite) {
        var program = Filter.programs["normalScale"];
        if(!program){
            program = new cc.GLProgram();
            program.initWithString(Filter.SHADER_POSITION_GRAY_VERT, Filter.SHADER_POSITION_NORMAL_FRAG);
            program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);        //cocos会做初始化的工作
            program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            program.link();
            program.updateUniforms();
            Filter.programs["normalScale"] = program;
        }
        gl.useProgram(program.getProgram());
        sprite.shaderProgram = program;
    }

};