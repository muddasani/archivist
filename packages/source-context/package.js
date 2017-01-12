import SourceContext from './SourceContext'

export default {
  name: 'archivist-reader-source',
  configure: function(config) {
    config.addContext('source', SourceContext, true)
    config.addIcon('source', {'fontawesome': 'fa-youtube-play'})
    config.addLabel('source', {
      en: 'Source',
      ru: 'Источник'
    })
    config.addLabel('tech-project_name', {
      en: 'Project name',
      ru: 'Название проекта'
    })
    config.addLabel('tech-conductor', {
      en: 'Interview conductor',
      ru: 'Интервьюер'
    })
    config.addLabel('tech-operator', {
      en: 'Operator',
      ru: 'Оператор'
    })
    config.addLabel('tech-sound_operator', {
      en: 'Sound operator',
      ru: 'Звуковой оператор'
    })
    config.addLabel('tech-interview_location', {
      en: 'Interview location',
      ru: 'Место интервью'
    })
    config.addLabel('tech-interview_date', {
      en: 'Interview date',
      ru: 'Дата'
    })
  }
}