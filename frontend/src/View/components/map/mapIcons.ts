import L from 'leaflet';

export function makeClusterIcon(
    lostCount: number,
    foundCount: number,
    size: number
): L.DivIcon {
    const total    = lostCount + foundCount;
    const isSingle = total === 1;
    const isLost   = lostCount > 0 && foundCount === 0;
    const isFound  = foundCount > 0 && lostCount === 0;
    const color    = isLost ? '#f43f5e' : isFound ? '#10b981' : '#a78bfa';
    const label    = total > 99 ? '99+' : String(total);
    const pinSize       = isSingle ? Math.round(size * 0.7) : size;
    const h             = Math.round(pinSize * 1.33);
    const isDoubleDigit = total >= 10;
    const circleR       = isSingle ? 4 : isDoubleDigit ? 6.5 : 5;
    const fs            = isDoubleDigit ? 5.5 : 7.5;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pinSize}" height="${h}" viewBox="0 0 24 32">
        <path d="M12 1C6.477 1 2 5.477 2 11c0 7 10 20 10 20s10-13 10-20c0-5.523-4.477-10-10-10z"
            fill="${color}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <circle cx="12" cy="11" r="${circleR}" fill="rgba(255,255,255,0.92)"/>
        ${!isSingle ? `<text x="12" y="${11 + fs * 0.38}"
              text-anchor="middle"
              font-family="'Segoe UI',system-ui,sans-serif"
              font-size="${fs}" font-weight="800"
              fill="${color}">${label}</text>` : ''}
    </svg>`;

    return new L.DivIcon({
        html:        svg,
        className:   '',
        iconSize:    [pinSize, h],
        iconAnchor:  [pinSize / 2, h],
        popupAnchor: [0, -(h + 2)],
    });
}


export function makeLabelIcon(name: string, fontSize: string, theme: string): L.DivIcon {
    const isDark    = theme !== 'light';
    const textColor = isDark ? 'rgba(200,212,255,0.85)' : 'rgba(30,50,120,0.85)';
    const shadow    = isDark
        ? '0 0 8px rgba(59,130,246,0.65),0 1px 3px rgba(0,0,0,0.95)'
        : '0 1px 3px rgba(255,255,255,0.9),0 0 6px rgba(59,130,246,0.3)';

    return new L.DivIcon({
        html: `<span style="
            font-size:${fontSize};
            font-family:'Segoe UI',Tahoma,sans-serif;
            font-weight:600;
            color:${textColor};
            text-shadow:${shadow};
            white-space:nowrap;
            pointer-events:none;
            user-select:none;
        ">${name}</span>`,
        className:  '',
        iconAnchor: [0, 0],
    });
}