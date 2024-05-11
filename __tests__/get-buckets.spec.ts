import { getBuckets$ } from "../browser/src/hash/get-buckets";


test('can find the correct buckets', function() {
    // const x = 0.8295740593348059;  // first and last bit set
    // const x = 1230.8295740593355;  // first and last bit set
    const x = 22230.722;
    const y = 21230.720;

    const r = getBuckets$([x,y]);//?
    const r_ = [93242544878.75, 93242544878.6875, 93242282734.75, 93242282734.6875];

    expect(r).toStrictEqual(r_);
});
