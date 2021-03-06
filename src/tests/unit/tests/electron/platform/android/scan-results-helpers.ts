// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink } from 'common/guidance-links';
import {
    AndroidScanResults,
    DeviceInfo,
    RuleResultsData,
    ViewElementData,
} from 'electron/platform/android/android-scan-results';
import {
    AccessibilityHierarchyCheckResult,
    AtfaBoundingRectangle,
    SpannableString,
    ViewHierarchyElement,
} from 'electron/platform/android/atfa-data-types';
import { RuleInformation } from 'electron/platform/android/rule-information';

export function buildScanResultsObject(
    deviceName?: string,
    appIdentifier?: string,
    resultsArray?: RuleResultsData[],
    axeView?: ViewElementData,
    axeVersion?: string,
    screenshotData?: string,
    deviceInfo?: DeviceInfo,
    atfaResults?: AccessibilityHierarchyCheckResult[],
): AndroidScanResults {
    return new AndroidScanResults({
        AxeResults: buildAxeScanResultsObject(
            deviceName,
            appIdentifier,
            resultsArray,
            axeView,
            axeVersion,
            screenshotData,
            deviceInfo,
        ),
        ATFAResults: atfaResults,
    });
}

export function buildAxeScanResultsObject(
    deviceName?: string,
    appIdentifier?: string,
    resultsArray?: RuleResultsData[],
    axeView?: ViewElementData,
    axeVersion?: string,
    screenshotData?: string,
    deviceInfo?: DeviceInfo,
): any {
    const axeResults = {};
    const axeContext = {};
    let addContext = false;

    if (deviceInfo) {
        axeContext['axeDevice'] = deviceInfo;
        addContext = true;
    }

    if (deviceName) {
        deviceInfo = { ...deviceInfo, name: deviceName } as DeviceInfo;
        axeContext['axeDevice'] = deviceInfo;
        addContext = true;
    }

    if (appIdentifier) {
        const axeMetaData = {};
        axeMetaData['appIdentifier'] = appIdentifier;
        axeContext['axeMetaData'] = axeMetaData;
        addContext = true;
    }

    if (axeView) {
        axeContext['axeView'] = axeView;
        addContext = true;
    }

    if (axeVersion) {
        if (axeContext['axeMetaData'] == null) {
            axeContext['axeMetaData'] = {};
        }

        axeContext['axeMetaData']['axeVersion'] = axeVersion;
        addContext = true;
    }

    if (screenshotData) {
        axeContext['screenshot'] = screenshotData;
        addContext = true;
    }

    if (resultsArray) {
        axeResults['axeRuleResults'] = resultsArray;
    }

    if (addContext) {
        axeResults['axeContext'] = axeContext;
    }

    return axeResults;
}

export function buildRuleResultObject(
    ruleId: string,
    status: string,
    axeViewId?: string,
    props?: any,
): RuleResultsData {
    const result = {};
    result['ruleId'] = ruleId;
    result['status'] = status;
    if (axeViewId) {
        result['axeViewId'] = axeViewId;
    }
    if (props) {
        result['props'] = props;
    }

    return result as RuleResultsData;
}

export function buildViewElement(
    axeViewId: string,
    boundsInScreen: any,
    className: string,
    contentDescription: string,
    text: string,
    children: ViewElementData[],
): ViewElementData {
    const viewElement = {
        axeViewId: axeViewId,
        boundsInScreen: boundsInScreen,
        className: className,
        contentDescription: contentDescription,
        text: text,
        children: children,
    };

    return viewElement as ViewElementData;
}

export function buildRuleInformation(
    ruleId: string,
    ruleLink = 'rule-link',
    guidance: GuidanceLink[] = [],
): RuleInformation {
    return {
        ruleId: ruleId,
        ruleDescription: 'This describes ' + ruleId,
        ruleLink,
        guidance,
        getUnifiedResolutionDelegate: r => {
            expect('getUnifiedResolution').toBe('This code should never execute');
            return null!;
        },
        getUnifiedResolution: r => {
            const summary: string = 'How to fix ' + ruleId;
            return { howToFixSummary: summary };
        },
        getResultStatusDelegate: r => {
            expect('includeThisResultDelegate').toBe('This code should never execute');
            return null!;
        },
        getResultStatus: r => {
            return r.status === 'FAIL' || r.status === 'ERROR' || r.status === 'WARNING'
                ? 'fail'
                : 'pass';
        },
    } as RuleInformation;
}

export function buildAtfaResult(
    accessibilityClassName: string,
    id: number,
    className: string,
    resultId: number,
    checkClass: string,
    type: string,
    boundsInScreen?: any,
    contentDescription?: string,
    text?: string,
    metadata?: any,
): AccessibilityHierarchyCheckResult {
    const element: ViewHierarchyElement = buildAtfaElement(
        accessibilityClassName,
        id,
        className,
        boundsInScreen,
        contentDescription,
        text,
    );

    const result = {};
    result['AccessibilityHierarchyCheckResult.element'] = element;
    result['AccessibilityHierarchyCheckResult.resultId'] = resultId;
    result['AccessibilityCheckResult.checkClass'] = checkClass;
    result['AccessibilityCheckResult.type'] = type;
    if (metadata) {
        result['AccessibilityHierarchyCheckResult.metadata'] = metadata;
    }

    return result as AccessibilityHierarchyCheckResult;
}

function buildAtfaRectangle(boundsInScreen: any): AtfaBoundingRectangle {
    const r = {};
    r['Rect.bottom'] = boundsInScreen.bottom;
    r['Rect.left'] = boundsInScreen.left;
    r['Rect.right'] = boundsInScreen.right;
    r['Rect.top'] = boundsInScreen.top;

    return r as AtfaBoundingRectangle;
}

function buildAtfaSpannableString(rawString: string): SpannableString {
    const s = {};
    s['SpannableString.rawString'] = rawString;
    return s as SpannableString;
}

function buildAtfaElement(
    accessibilityClassName: string,
    id: number,
    className: string,
    boundsInScreen?: any,
    contentDescription?: string,
    text?: string,
): ViewHierarchyElement {
    const e = {};
    e['ViewHierarchyElement.accessibilityClassName'] = accessibilityClassName;
    e['ViewHierarchyElement.id'] = id;
    e['ViewHierarchyElement.className'] = className;

    if (boundsInScreen) {
        e['ViewHierarchyElement.boundsInScreen'] = buildAtfaRectangle(boundsInScreen);
    }
    if (contentDescription) {
        e['ViewHierarchyElement.contentDescription'] = buildAtfaSpannableString(contentDescription);
    }
    if (text) {
        e['ViewHierarchyElement.contentDescription'] = buildAtfaSpannableString(text);
    }
    return e as ViewHierarchyElement;
}
