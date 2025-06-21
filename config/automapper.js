import automapper from 'automapper-ts';
import ProjectDTO from '../shared/ProjectDTO.js';
import ProfileDTO from '../shared/ProfileDTO.js';
import ProfessionDTO from '../shared/ProfessionDTO.js'

automapper.createMap('Project', 'ProjectDTO')
    .forMember('profession', opts => opts.mapFrom('professionId'))
    .forMember('fannpage', opts => opts.mapFrom('facebookFanpageId'))

automapper.createMap('User', 'ProfileDTO')
    .forMember('id', opts => opts.mapFrom('_id'))

automapper.createMap('Profession', 'ProfessionDTO')
    .forMember('value', opts => opts.mapFrom('_id'))
    .forMember('label', opts => opts.mapFrom('name'))

export { automapper, ProjectDTO, ProfileDTO, ProfessionDTO };