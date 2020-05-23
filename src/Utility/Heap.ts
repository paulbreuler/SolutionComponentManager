export interface IHeapItem<T> {
    HeapIndex: number;
    compareTo: (obj: T) => number;
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

    public get size(): number {
        return this._items.length;
    }

    public get isEmpty(): boolean {
        return this._items.length === 0;
    }

    public clear(): void {
        this._items.length = 0;
        this._currentItemCount = 0;
    }

    public contains(item: T) {

    }

    public Add(item: T) {
        item.HeapIndex = this._currentItemCount;
        this._items[this._currentItemCount] = item;
        this.SortUp(item);
        this._currentItemCount++;
    }

    public RemoveFirst(): T {
        // Remove first item and reduce heap count.
        let firstItem: T = this._items.shift();
        this._currentItemCount--;

        // Take last item and make it first
        this._items.unshift(this._items.pop());
        this._items[0].HeapIndex = 0;

        // Sort item down to maintain order
        this.SortDown(this._items[0]);

        return firstItem;
    }

    private SortUp(item: T) {
        let parentIndex: number = Math.floor((item.HeapIndex - 1) / 2);

        while (true) {
            let parentItem: T = this._items[parentIndex];
            let compare = item.compareTo(parentItem)
            if (compare > 0) {
                this.Swap(item, parentItem);
            }
            else {
                break;
            }

            parentIndex = Math.floor((item.HeapIndex - 1) / 2);
        }
    }

    private SortDown(item: T) {
        while (true) {
            let childIndexLeft: number = item.HeapIndex * 2 + 1;    // 2n + 1
            let childIndexRight: number = item.HeapIndex * 2 + 2;   // 2n + 2
            let swapIndex: number = 0;

            // Does this item have a child on the left. Set to left by default.
            if (childIndexLeft < this._currentItemCount) {
                swapIndex = childIndexLeft;

                // Does this item have a child on the right?
                if (childIndexRight < this._currentItemCount) {

                    // Which child has the highest priority
                    if (this._items[childIndexLeft].compareTo(this._items[childIndexRight]) < 0) {
                        swapIndex = childIndexRight;
                    }
                }

                // If the parent is lower priority then swap.
                if (item.compareTo(this._items[swapIndex]) < 0) {
                    this.Swap(item, this._items[swapIndex]);
                }
                else {
                    // Parent is in correct position. Exit loop.
                    return;
                }

            }
            else {
                // No children
                return;
            }

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