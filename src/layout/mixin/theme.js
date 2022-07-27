const version = require("element-ui/package.json").version; // element-ui version from node_modules
const ORIGINAL_THEME = "#409EFF"; // default color

export default {
    data() {
        return {
            chalk: "", // content of theme-chalk css
            theme: "",
        };
    },
    methods: {
        async updateTheme(val) {
            const oldVal = this.chalk ? this.theme : ORIGINAL_THEME;
            if (typeof val !== "string") return;
            const themeCluster = this.getThemeCluster(val.replace("#", ""));
            const originalCluster = this.getThemeCluster(
                oldVal.replace("#", "")
            );
            const getHandler = (variable, id) => {
                return () => {
                    const originalCluster = this.getThemeCluster(
                        ORIGINAL_THEME.replace("#", "")
                    );
                    const newStyle = this.updateStyle(
                        this[variable],
                        originalCluster,
                        themeCluster
                    );

                    let styleTag = document.getElementById(id);
                    if (!styleTag) {
                        styleTag = document.createElement("style");
                        styleTag.setAttribute("id", id);
                        document.head.appendChild(styleTag);
                    }
                    styleTag.innerText = newStyle;
                };
            };

            if (!this.chalk) {
                const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
                await this.getCSSString(url, "chalk");
            }

            const chalkHandler = getHandler("chalk", "chalk-style");

            chalkHandler();

            const styles = [].slice
                .call(document.querySelectorAll("style"))
                .filter((style) => {
                    const text = style.innerText;
                    return (
                        new RegExp(oldVal, "i").test(text) &&
                        !/Chalk Variables/.test(text)
                    );
                });
            styles.forEach((style) => {
                const { innerText } = style;
                if (typeof innerText !== "string") return;
                style.innerText = this.updateStyle(
                    innerText,
                    originalCluster,
                    themeCluster
                );
            });

            let root = document.querySelector(":root");
            root.style.setProperty("--default-color", val);
            root.style.setProperty(
                "--default-shallow-color",
                this.hexToRgba(val, 0.3).rgba
            );
            
            this.$emit("change", val);
        },
        updateStyle(style, oldCluster, newCluster) {
            let newStyle = style;
            oldCluster.forEach((color, index) => {
                newStyle = newStyle.replace(
                    new RegExp(color, "ig"),
                    newCluster[index]
                );
            });
            return newStyle;
        },

        getCSSString(url, variable) {
            return new Promise((resolve) => {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        this[variable] = xhr.responseText.replace(
                            /@font-face{[^}]+}/,
                            ""
                        );
                        resolve();
                    }
                };
                xhr.open("GET", url);
                xhr.send();
            });
        },

        getThemeCluster(theme) {
            const tintColor = (color, tint) => {
                let red = parseInt(color.slice(0, 2), 16);
                let green = parseInt(color.slice(2, 4), 16);
                let blue = parseInt(color.slice(4, 6), 16);

                if (tint === 0) {
                    // when primary color is in its rgb space
                    return [red, green, blue].join(",");
                } else {
                    red += Math.round(tint * (255 - red));
                    green += Math.round(tint * (255 - green));
                    blue += Math.round(tint * (255 - blue));

                    red = red.toString(16);
                    green = green.toString(16);
                    blue = blue.toString(16);

                    return `#${red}${green}${blue}`;
                }
            };

            const shadeColor = (color, shade) => {
                let red = parseInt(color.slice(0, 2), 16);
                let green = parseInt(color.slice(2, 4), 16);
                let blue = parseInt(color.slice(4, 6), 16);

                red = Math.round((1 - shade) * red);
                green = Math.round((1 - shade) * green);
                blue = Math.round((1 - shade) * blue);

                red = red.toString(16);
                green = green.toString(16);
                blue = blue.toString(16);

                return `#${red}${green}${blue}`;
            };

            const clusters = [theme];
            for (let i = 0; i <= 9; i++) {
                clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
            }
            clusters.push(shadeColor(theme, 0.1));
            return clusters;
        },
        hexToRgba(hex, opacity) {
            var RGBA =
                "rgba(" +
                parseInt("0x" + hex.slice(1, 3)) +
                "," +
                parseInt("0x" + hex.slice(3, 5)) +
                "," +
                parseInt("0x" + hex.slice(5, 7)) +
                "," +
                opacity +
                ")";
            return {
                red: parseInt("0x" + hex.slice(1, 3)),
                green: parseInt("0x" + hex.slice(3, 5)),
                blue: parseInt("0x" + hex.slice(5, 7)),
                rgba: RGBA,
            };
        },
    },
}