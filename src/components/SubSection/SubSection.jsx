/**
 * 二级内容分类
 * 最热|流行|摇滚|民谣
 */
import React from 'react'

function SubSection (props) {
  return (
    <ul className="section-titles">
    {
      props.sectionTitles.map((item, index) =>
        <li className={props.index === index ? 'on' : ''} key={index} onClick={props.handleSectionTitle.bind(this, index)}>
          <a>{item}</a>
        </li>
      )
    }
    </ul>
  )
}

export default SubSection
