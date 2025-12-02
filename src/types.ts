export enum Rarity {
    N = 'N',
    R = 'R',
    SR = 'SR',
    SSR = 'SSR',
}

export interface CreatureData {
    description: string;
    rarity: Rarity;
    hp: number;
    atk: number;
    def: number;
}
