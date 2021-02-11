export class Menu1Config {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					root: true,
					title: 'Subscription',
					alignment: 'left',   
					page: '/subscription',
				},
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
