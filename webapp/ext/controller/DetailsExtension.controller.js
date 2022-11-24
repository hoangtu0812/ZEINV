sap.ui.define([], function () {
    return { //
        onIssue: function (oEvent) {
            var oModel = this.getView().getModel()
            var oData = oModel.oData
            console.log(oData)
            for (const key in oData) {
                if (key.includes('Header')) {
                    var headerUrl = key
                    console.log(headerUrl)
                    callAPIHeader(headerUrl)
                }
            }
        },
        onPrint: function (oEvent) {
            var oModel = this.getView().getModel()
            var oData = oModel.oData
            var sPath = oEvent.getSource().getBindingContext().sPath
            console.log(sPath)
            callAPIHeader(sPath)
        }
    }
})

function callAPI(url, level) {
    var mUrl = '/sap/opu/odata/sap/ZUI_EINV'
    if (url.trim() == null || url.trim() == '') {
        mUrl = '/sap/opu/odata/sap/ZUI_EINV/'
    } else {
        mUrl = mUrl + url
    }
    // console.log(mUrl)
    var myHeaders = new Headers()
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
        mode: "no-cors"


    }
    var xml = ''
    fetch(mUrl, requestOptions).then(response => response.text()).then(result => {
        xml = $.parseXML(result)
        if (level == 'Header') {
            console.log(xml)
            var contents = xml.getElementsByTagName("content")
            for (var i = 0; i < contents.length; i++) {
                var data = contents[i]
                var properties = data.getElementsByTagName('m:properties')
                console.log(properties)
                for (var j = 0; j < properties.length; j++) {
                    console.log(properties[j])

                }
            }
        }
        if (level == 'Detail') {}

    }).catch(error => console.log('error', error))
}


function callAPIHeader(url) { // var header = new header()
    const to_detail     =  '/to_detail'
    const contextUrl    = '/sap/opu/odata/sap/ZUI_EINV/'
    url = contextUrl + url
    var myHeaders       = new Headers()
    var requestOptions  = {
        method  : 'GET',
        headers : myHeaders,
        redirect: 'follow',
        modle   : 'no-cors'
    }
    fetch(url, requestOptions).then(response => response.text()).then(result => {
        var xmlHeader = $.parseXML(result)
        var header = processHeaderXml(xmlHeader)
        /*Get detail*/
        url = url + to_detail
        console.log(url)
        fetch(url, requestOptions).then(response => response.text()).then(result => {
            var xmlDetail = $.parseXML(result)
            var items = processItemsXml(xmlDetail)
            console.log(items)
            convertXml(header, items)
            issueVNPT()
        }).catch(error => console.log('get detail error: ' + error))
        
    }).catch(error => console.log('get header error: ' + error))

}

function callAPIItems(url) {
    var items
    return items
}

/**
 * Process Header XML
 * @param {*} xml import header XML
 * @returns Header object
 */
function processHeaderXml(xml) {
    var properties = xml.getElementsByTagName('m:properties')
    var property = properties[0]
    var bukrs = property.getElementsByTagName('d:bukrs')
    var belnr = property.getElementsByTagName('d:belnr')
    var gjahr = property.getElementsByTagName('d:gjahr')
    var vbeln = property.getElementsByTagName('d:vbeln')
    var budat = property.getElementsByTagName('d:budat')
    var waers = property.getElementsByTagName('d:waers')
    var companyCode     = bukrs[0].childNodes[0].nodeValue
    var documentNo      = belnr[0].childNodes[0].nodeValue
    var documentYear    = gjahr[0].childNodes[0].nodeValue
    var billingDocument = vbeln[0].childNodes[0].nodeValue
    var postingtDate    = budat[0].childNodes[0].nodeValue
    var currency        = waers[0].childNodes[0].nodeValue
    var header = {
        companyCode     : companyCode,
        documentNo      : documentNo,
        documentYear    : documentYear,
        billingDocument : billingDocument,
        postingtDate    : postingtDate,
        currency        : currency
    }
    return header
}
/**
 * Process item XML
 * @param {*} xml 
 * @returns 
 */
function processItemsXml(xml) {
    console.log(xml)
    var items = []
    var properties = xml.getElementsByTagName('m:properties')
    for(var i = 0; i < properties.length; i++) {
        var property = properties[i]
        var vbeln = property.getElementsByTagName('d:vbeln')
        var posnr = property.getElementsByTagName('d:posnr')
        var bukrs = property.getElementsByTagName('d:bukrs')
        var belnr = property.getElementsByTagName('d:belnr')
        var gjahr = property.getElementsByTagName('d:gjahr')
        var billingDocument     = vbeln[0].childNodes[0].nodeValue
        var lineItem            = posnr[0].childNodes[0].nodeValue
        var companyCode         = bukrs[0].childNodes[0].nodeValue
        var documentNo          = belnr[0].childNodes[0].nodeValue
        var documentYear        = gjahr[0].childNodes[0].nodeValue
        var item = {
            billingDocument : billingDocument,
            lineItem        : lineItem,
            companyCode     : companyCode,
            documentNo      : documentNo,
            documentYear    : documentYear
        }
        items.push(item)
    }
    // console.log(items)
    return items
}

function convertXml(header, items) {
    console.log(header)
    console.log(items)
}

function issueVNPT() {

}