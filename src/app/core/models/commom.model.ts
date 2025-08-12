export interface IRecipe {
    id?: string;
    title: string | null;
    category: string | null;
    duration: string | null;
    ingredients: { name: string | null, quantity: string | null }[];
    instructions: string | null;
}

export interface IRecipeResponse extends IRecipe {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}