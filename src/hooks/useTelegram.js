import { useEffect, useState } from "react";

export function useTelegram() {
    const tg = window.Telegram.WebApp;
    const [user, setUser] = useState(null);
    const [startParam, setStartParam] = useState(null);
    const [theme, setTheme] = useState(tg.colorScheme);

    useEffect(() => {
        tg.ready(); // Initialize Telegram WebApp
        tg.expand(); // Expand to full screen

        const webAppUser = tg.initDataUnsafe?.user;
        if (webAppUser) {
            setUser({
                id: webAppUser.id,
                username: webAppUser.username || `${webAppUser.first_name} ${webAppUser.last_name || ""}`.trim(),
                first_name: webAppUser.first_name,
                last_name: webAppUser.last_name,
                photo_url: webAppUser.photo_url || "https://via.placeholder.com/50",
            });

            // Extract referral code from `start_param`
            if (tg.initDataUnsafe.start_param) {
                setStartParam(tg.initDataUnsafe.start_param);
                localStorage.setItem("referralCode", tg.initDataUnsafe.start_param);
            }
        }

        // Handle theme change event
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
        startParam,
        close: tg.close,
        expand: tg.expand,
        showMainButton: (text, onClick) => {
            tg.MainButton.setText(text);
            tg.MainButton.show();
            tg.MainButton.onClick(onClick);
        },
    };
}
