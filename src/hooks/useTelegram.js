import { useEffect } from "react";

export function useTelegram() {
    const tg = typeof window !== "undefined" && window.Telegram ? window.Telegram.WebApp : null;

    useEffect(() => {
        if (tg) {
            tg.ready(); // Ensure Telegram WebApp is initialized
        }
    }, [tg]);

    return {
        tg,
        theme: tg ? tg.colorScheme : "light",
        close: tg ? tg.close : () => console.warn("Telegram WebApp not available"),
        expand: tg ? tg.expand : () => console.warn("Telegram WebApp not available"),
        showMainButton: (text, onClick) => {
            if (tg) {
                tg.MainButton.setText(text);
                tg.MainButton.show();
                tg.MainButton.onClick(onClick);
            } else {
                console.warn("Telegram WebApp not available");
            }
        },
    };
}
