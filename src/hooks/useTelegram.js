import { useEffect, useState } from "react";

export function useTelegram() {
    const [tg, setTg] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined" && window.Telegram?.WebApp) {
            const webApp = window.Telegram.WebApp;
            webApp.ready();
            setTg(webApp);
        }
    }, []);

    return {
        tg,
        theme: tg ? tg.colorScheme : "light",
        close: () => tg?.close(),
        expand: () => tg?.expand(),
        showMainButton: (text, onClick) => {
            if (tg?.MainButton) {
                tg.MainButton.setText(text);
                tg.MainButton.show();
                tg.MainButton.onClick(onClick);
            } else {
                console.warn("Telegram WebApp MainButton not available");
            }
        },
    };
}