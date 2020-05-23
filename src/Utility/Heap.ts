export interface IHeapItem<T> {
    HeapIndex: number;
    compare: (obj: T) => number;
}

export class Heap<T extends IHeapItem<T>>  {
    private _items: Array<T>;
    private _currentItemCount: number = 0;

    constructor() {
        this._items = new Array<T>();
    }

    public peek(): T | undefined {
        return this._items[0];
    }

    public size(): number {
        return this._items.length;
    }

    public Add(item: T) {
        item.HeapIndex = this._currentItemCount;
        this._items[this._currentItemCount] = item;
        this.SortUp(item);
        this._currentItemCount++;
    }


    private SortUp(item: T) {
        let parentIndex: number = Math.floor((item.HeapIndex - 1) / 2);

        while (true) {
            let parentItem: T = this._items[parentIndex];
            let compare = item.compare(parentItem)
            if (compare > 0) {
                this.Swap(item, parentItem);
            }
            else {
                break;
            }

            parentIndex = Math.floor((item.HeapIndex - 1) / 2);
        }
    }

    public Swap(itemA: T, itemB: T) {
        this._items[itemA.HeapIndex] = itemB;
        this._items[itemB.HeapIndex] = itemA;
        let itemAIndex: number = itemA.HeapIndex;
        itemA.HeapIndex = itemB.HeapIndex;
        itemB.HeapIndex = itemAIndex;
    }
}