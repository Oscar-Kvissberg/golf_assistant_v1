interface ClubConfig {
    name: string;
    displayName: string;
    assistantId: string;
    logo: string;
}

export const clubs: Record<string, ClubConfig> = {
    vasatorp: {
        name: 'vasatorp',
        displayName: 'Vasatorps GK',
        assistantId: 'asst_qZsHsAUoPZ0gH0HqBLLhCdeZ',
        logo: '/Vasatorp_logga.png'
    },
    klubb_a: {
        name: 'klubb_a',
        displayName: 'Klubb A',
        assistantId: 'asst_abc123def456ghi789',
        logo: '/klubb_a_logo.png'
    },
    klubb_b: {
        name: 'klubb_b',
        displayName: 'Klubb B',
        assistantId: 'asst_xyz789uvw456rst123',
        logo: '/klubb_b_logo.png'
    },
    klubb_c: {
        name: 'klubb_c',
        displayName: 'Klubb C',
        assistantId: 'asst_mno123pqr456stu789',
        logo: '/klubb_c_logo.png'
    },
    // Lägg till fler klubbar här
    // Exempel:
    // another_club: {
    //     name: 'Another Club',
    //     assistantId: 'asst_xxxxx'
    // }
}; 