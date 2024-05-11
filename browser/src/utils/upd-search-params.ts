
function updSearchParams(
        searchParamsStr: string,
        updObj: { [k:string]: string }): string {

    const searchParams = new URLSearchParams(searchParamsStr);
    const paramMap = new Map(Array.from(searchParams.entries()));

    for (const k in updObj) {
        const v = updObj[k];
        paramMap.set('configuration', v);
    }

    let searchParamsStr_ = '';
    let appender = '';
    for (const [k,v] of paramMap) {
        searchParamsStr_ += `${appender}${k}=${encodeURIComponent(v)}`;
        appender = '&';
    }

    return searchParamsStr_;
}


export { updSearchParams }
