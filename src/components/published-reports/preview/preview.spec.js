import React from 'react';
import renderer from 'react-test-renderer';
import Preview from './preview';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NotShownMessage from
    '../../dataset-data/table-section-container/not-shown-message/not-shown-message';
import Analytics from '../../../utils/analytics/analytics';

describe('Preview component', () => {
  let component = renderer.create();
  let instance;
  const spy = jest.spyOn(Analytics, 'event');

  const mockTestReport = 'This is a text report';
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, text: () => Promise.resolve(mockTestReport) }));

  beforeEach(() => {
    renderer.act(() => {
      component = renderer.create(
        <Preview />
      )
    });
    instance = component.root;
  });

  it('contains an icon in the header section', () => {
    const icon = instance.findByProps({'data-testid': 'tableIcon'});
    expect(icon.type).toBe(FontAwesomeIcon);
  });

  it('contains a title', () => {
    const title = instance.findByProps({'data-testid': 'title'});
    expect(title).toBeDefined();
  });

  it('contains a content section', () => {
    const content = instance.findByProps({'data-testid': 'previewContent'});
    expect(content.children[0]).toBeDefined();
  });

  it('displays a message when no report is selected', () => {
    const message = instance.findByType(NotShownMessage);
    expect(message.props.heading).toStrictEqual('Select a Report Above To Generate A Preview');
  });

  it('displays a preview when a pdf report is selected', () => {
    const file = 'hello.pdf',
      groupName = 'groupName (.pdf)';

    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
            path: file,
            report_group_desc: groupName
          }}
        />);
    })

    const objectTag = instance.findByType('embed');
    const title = instance.findByProps({'data-testid': 'title'});

    expect(objectTag.props.src).toBe(file);
    expect(title.props.children).toBe(groupName);
  });

  it('transmits a correctly formed analytics event when a pdf preview is loaded ', () => {
    spy.mockClear();
    const file = 'helloAgain.pdf';
    const groupName = 'groupName (.pdf)';

    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
            path: file,
            report_group_desc: groupName
          }}
        />);
    });
    expect(spy).toHaveBeenCalledWith({
      'action': 'load pdf preview',
      'category': 'Published Report Preview',
      'value': 'helloAgain.pdf'
    });
  });

  it('transmits a correctly formed analytics event when a txt preview is loaded ', () => {
    spy.mockClear();
    const file = 'helloAgain.txt';
    const groupName = 'groupName (.txt)';

    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
            path: file,
            report_group_desc: groupName
          }}
        />);
    });
    expect(spy).toHaveBeenCalledWith({
      'action': 'load text preview',
      'category': 'Published Report Preview',
      'value': 'helloAgain.txt'
    });
  });

  it('displays the content of a text for preview when file type is txt', async () => {
    spy.mockClear();

    const fetchSpy = jest.spyOn(global, 'fetch');
    const textFilename = 'helloAgain.txt';
    const groupName = 'groupName (.txt)';

    await renderer.act(async () => {
      await component.update(
        <Preview selectedFile={{
            path: textFilename,
            report_group_desc: groupName
          }}
        />);
    });

    expect(fetchSpy).toHaveBeenCalledWith(textFilename);
    const preformattedTextElement = instance.findByType('pre');
    expect(preformattedTextElement.props.children).toStrictEqual(mockTestReport);
  });

  it('transmits no analytics event when a non-previewable report is selected ', () => {
    spy.mockClear();
    const file = 'helloAgain.xlsx';
    const groupName = 'groupName (.xlsx)';

    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
            path: file,
            report_group_desc: groupName
          }}
        />)
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it('indicates a preview cannot be drawn when the selected file is not a previewable type', () => {
    let file = 'hello.xlsx',
      groupName = 'groupName (.xlsx)';

    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
            path: file,
            report_group_desc: groupName
          }}
        />);
    })


    let message = instance.findByType(NotShownMessage);
    expect(message.props.heading)
      .toStrictEqual('Preview cannot be displayed for this file type.');
    expect(message.props.bodyText).toStrictEqual('The selected file type is .xlsx');

    file = 'hello.pdf.zip';
    groupName = 'groupName (.pdf.zip)';

    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
            path: file,
            report_group_desc: groupName
          }}
        />);
    })

    message = instance.findByType(NotShownMessage);
    expect(message.props.heading)
      .toStrictEqual('Preview cannot be displayed for this file type.');
    expect(message.props.bodyText).toStrictEqual('The selected file type is .pdf.zip');
  });

  it(`reads the filetype extension from the path if it is unavailable in the
  group description`, () => {

    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
          path: 'hello.xls',
          report_group_desc: 'Announcements'
        }}
        />);
    });

    const message = instance.findByType(NotShownMessage);
    expect(message.props.heading)
      .toStrictEqual('Preview cannot be displayed for this file type.');
    expect(message.props.bodyText).toStrictEqual('The selected file type is .xls');
  });

  it(`indicates "unknown" for the filetype extension if it cannot be
  parsed from the filename OR from the report group description`, () => {

    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
          path: 'ReadMe',
          report_group_desc: 'Documentation'
        }}
        />);
    });

    const message = instance.findByType(NotShownMessage);
    expect(message.props.heading)
      .toStrictEqual('Preview cannot be displayed for this file type.');
    expect(message.props.bodyText).toStrictEqual('The selected file type is unknown');
  });

  it('sets the alt text to the correct string depending on if the dataset is MSPD or MTS', () => {
    const altTextMSPD = 'Preview the downloadable PDF report of the MSPD ' +
      'for the selected month and year for the previous five years.';
    const altTextMTS = 'Preview the downloadable PDF report of the MTS Receipts and Outlays ' +
      'of the U.S. Government for the selected month and year for the previous five years.';

    const file = 'hello.pdf';
    let groupName = 'Entire (.pdf)';

    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
            path: file,
            report_group_desc: groupName
          }}
        />);
    })

    expect(instance.findByProps({'data-test-id': 'embedElement'}).props.title).toBe(altTextMSPD);

    groupName = 'Monthly Treasury Statement (.pdf)';
    renderer.act(() => {
      component.update(
        <Preview selectedFile={{
            path: file,
            report_group_desc: groupName
          }}
        />);
    })
    expect(instance.findByProps({'data-test-id': 'embedElement'}).props.title).toBe(altTextMTS);
  });
});
