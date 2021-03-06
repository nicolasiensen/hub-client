import { EDIT_WIDGET, FETCH_WIDGETS } from '../../constants/ActionTypes'
import * as WidgetActions from './../../actions/WidgetActions'
import $ from 'jquery'

describe('WidgetActions', () => {
  describe('#fetchMobilizations', () => {
    it('should GET widgets using correct URL and dispatch action', () => {
      const dispatch = sandbox.spy()
      WidgetActions.fetchWidgets({mobilization_id: 1})(dispatch)
      const request = requests[0]
      const widgets = [{id: 1}, {id: 2}]
      expect(request.url).to.equal(`${process.env.API_URL}/mobilizations/1/widgets`)
      expect(request.method).to.equal('GET')
      request.respond(200, { "Content-Type": "application/json" }, JSON.stringify(widgets))
      expect(dispatch).to.have.been.calledWith({
        type: FETCH_WIDGETS,
        widgets
      })
    })
  })

  describe('#editWidget', () => {
    it('should PUT widget using correct URL and dispatch action', () => {
      const dispatch = sandbox.spy()
      const widget = {
        id: 2,
        settings: {content: 'text'}
      }
      WidgetActions.editWidget({
        mobilization_id: 1,
        widget_id: 2,
        widget
      })(dispatch)
      const request = requests[0]
      expect(request.url).to.equal(`${process.env.API_URL}/mobilizations/1/widgets/2`)
      expect(request.method).to.equal('PUT')
      expect(request.requestBody).to.equal(JSON.stringify({widget}))
      request.respond(200, { "Content-Type": "application/json" }, JSON.stringify(widget))
      expect(dispatch).to.have.been.calledWith({
        type: EDIT_WIDGET,
        widget
      })
    })
  })
})
