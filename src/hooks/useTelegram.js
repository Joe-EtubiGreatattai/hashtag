import { useEffect, useState } from "react";

export function useTelegram() {
    const tg = window.Telegram.WebApp;

    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState(tg.colorScheme);

    useEffect(() => {
        tg.ready(); // Initialize Telegram WebApp

        // Get user info
        setUser(tg.initDataUnsafe.user || null);

        // Listen for theme change
        const handleThemeChange = () => setTheme(tg.colorScheme);
        tg.onEvent("themeChanged", handleThemeChange);

        return () => {
            tg.offEvent("themeChanged", handleThemeChange);
        };
    }, []);

    return {
        tg,
        user,
        theme,
        close: tg.close,
        expand: tg.expand,
        showMainButton: (text, onClick) => {
            tg.MainButton.setText(text);
            tg.MainButton.show();
            tg.MainButton.onClick(onClick);
        },
    };
}
