describe('catke', function() {
    it('task', function(done) {
        var i = 0;
        require(['catke'], function(catke) {
            var task = new catke.Task(function() {
                i++;

                if (i === 2) {
                    task.remove(); //执行2次后,移除
                    done();
                } else {
                    if (i > 2) {
                        done('task error');
                    }
                }
            });
        });
    });
});
