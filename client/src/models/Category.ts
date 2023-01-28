import Amount from './Amount';

class Category {
    private _id: string;
    private _title: string;
    private _icon: string;

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get icon() {
        return this._icon;
    }

    set title(title: string) {
        this._title = title;
    }

    set icon(icon: string) {
        this._icon = icon;
    }

    constructor(category: {
        id: string;
        title: string;
        icon: string;
        amounts?: { [key: string]: Amount };
    }) {
        const { id, title, icon } = category;
        this._id = id;
        this._title = title;
        this._icon = icon;
    }
}

export default Category;