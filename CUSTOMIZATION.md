# Customization

Some customization cannot be done purely by the extension.


## Override typeConverter / data colors

For the `typeConverter` and `data` functions, there is no clear equivalent in other programming languages. Therefore, the colors of your theme might be a bit off. You can override the chosen colors by adding to the `settings.json` of VSCode (open the `settings.json` via the top bar entry `> Preferences: Open User Settings (JSON)`):

```json
{
    "workbench.colorTheme": "Default Light+",
    "editor.tokenColorCustomizations": {
        "[Default Light+]": {
            "textMateRules": [
                {
                    "scope": "entity.name.function.preprocessor.typeconverter",
                    "settings": {
                        "foreground": "#646464"
                    }
                },
                {
                    "scope": "entity.name.function.dataconverter",
                    "settings": {
                        "foreground": "#646464"
                    }
                }
            ]
        },
    }
}
```

Replace `[Default Light+]` by the theme you want to use.
