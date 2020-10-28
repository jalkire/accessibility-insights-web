// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSectionProps } from 'common/components/cards/failed-instances-section';
import { ResultSectionDeps } from 'common/components/cards/result-section';
import { NullComponent } from 'common/components/null-component';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { BaseSummaryReportSectionProps } from 'reports/components/report-sections/base-summary-report-section-props';
import {
    CollapsibleFailedResultsSection,
    CollapsibleFailedResultsSectionProps,
} from 'reports/components/report-sections/collapsible-failed-results-section';
import { CombinedReportSummarySection } from 'reports/components/report-sections/combined-report-summary-section';
import { SummaryReportDetailsSection } from 'reports/components/report-sections/summary-report-details-section';
import { SummaryReportHeaderSection } from 'reports/components/report-sections/summary-report-header-section';
import { SummaryReportHead } from 'reports/components/summary-report-head';
import { UrlResultCounts } from 'reports/package/accessibilityInsightsReport';
import { FooterTextForService } from 'reports/package/footer-text-for-service';
import { BodySection } from './body-section';
import { ContentContainer } from './content-container';
import { ReportFooter } from './report-footer';
import { ReportSectionFactory } from './report-section-factory';
import { ResultsContainer } from './results-container';
import { TitleSection } from './title-section';

export type CombinedReportSectionDeps = ResultSectionDeps;

export type CombinedReportSectionProps = BaseSummaryReportSectionProps &
    CollapsibleFailedResultsSectionProps & {
        deps: CombinedReportSectionDeps;
        cardsByRule: CardsViewModel;
        urlResultCounts: UrlResultCounts;
    };

export const CombinedReportSectionFactory: ReportSectionFactory<CombinedReportSectionProps> = {
    HeadSection: SummaryReportHead,
    BodySection,
    ContentContainer,
    HeaderSection: SummaryReportHeaderSection,
    TitleSection,
    SummarySection: CombinedReportSummarySection,
    DetailsSection: SummaryReportDetailsSection,
    ResultsContainer,
    FailedInstancesSection: CollapsibleFailedResultsSection,
    PassedChecksSection: NullComponent,
    NotApplicableChecksSection: NullComponent,
    FooterSection: ReportFooter,
    FooterText: FooterTextForService,
    resultSectionsOrder: ['failed', 'notApplicable', 'passed'],
};
